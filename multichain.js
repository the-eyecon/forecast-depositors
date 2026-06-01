import { ethers } from "ethers";
import fs from "fs";
import path from "path";

const DEPOSIT_ADDRESS = "0xf605767bb0636fe082b20b2999a6957e3c772378";

// USDC contracts
const BASE_USDC = "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913";
const ETH_USDC = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";

// RPCs
const baseProvider = new ethers.JsonRpcProvider("https://mainnet.base.org");
const ethProvider = new ethers.JsonRpcProvider("https://ethereum-rpc.publicnode.com");

// Use the block where deposits started on Base
const BASE_START_BLOCK = 45903056;

// Change if you know an earlier Ethereum start block
const ETH_START_BLOCK = 25081185;

const CHUNK_SIZE = 10000;

const abi = [
  "event Transfer(address indexed from, address indexed to, uint256 value)"
];

async function scanChain({
  provider,
  usdcAddress,
  startBlock,
  chainName,
  latestBlock,
  latestTimestamp,
  blockTime,
}) {
  const usdc = new ethers.Contract(usdcAddress, abi, provider);

  console.log(`\n========== ${chainName.toUpperCase()} ==========`);
  console.log("Latest Block:", latestBlock);
  console.log("Scanning from:", startBlock);

  const uniqueWallets = new Set();
  let totalTransfers = 0;
  let totalUSDC = 0;
  const transfers = [];

  for (
    let fromBlock = startBlock;
    fromBlock <= latestBlock;
    fromBlock += CHUNK_SIZE
  ) {
    const toBlock = Math.min(fromBlock + CHUNK_SIZE - 1, latestBlock);

    try {
      console.log(`${chainName}: ${fromBlock} -> ${toBlock}`);

      const events = await usdc.queryFilter(
        usdc.filters.Transfer(null, DEPOSIT_ADDRESS),
        fromBlock,
        toBlock
      );

      totalTransfers += events.length;

      for (const event of events) {
        const from = event.args.from.toLowerCase();
        const value = Number(ethers.formatUnits(event.args.value, 6));
        const txHash = event.transactionHash;
        const blockNumber = event.blockNumber;

        // Estimate timestamp
        const estimatedTimestamp = latestTimestamp - (latestBlock - blockNumber) * blockTime;
        const dateStr = new Date(estimatedTimestamp * 1000).toISOString().split("T")[0];

        uniqueWallets.add(from);
        totalUSDC += value;

        transfers.push({
          txHash,
          from,
          amount: value,
          blockNumber,
          date: dateStr,
          chain: chainName,
        });
      }

      console.log(
        `${chainName}: txs=${totalTransfers}, unique=${uniqueWallets.size}, totalUSDC=${totalUSDC.toFixed(2)}`
      );
    } catch (err) {
      console.error(
        `${chainName}: failed chunk ${fromBlock}-${toBlock}`,
        err.message
      );
    }
  }

  return {
    uniqueWallets,
    totalTransfers,
    totalUSDC,
    transfers,
  };
}

export async function runScan() {
  console.log("Initializing Blockchain Scanners...");
  
  // 1. Fetch latest blocks and timestamps for estimation
  let latestBaseBlock, latestEthBlock;
  try {
    [latestBaseBlock, latestEthBlock] = await Promise.all([
      baseProvider.getBlock("latest"),
      ethProvider.getBlock("latest"),
    ]);
  } catch (err) {
    console.error("Failed to fetch latest block info, using mock block headers", err.message);
    // Fallbacks in case RPC is unreachable
    latestBaseBlock = { number: 46000000, timestamp: Math.floor(Date.now() / 1000) };
    latestEthBlock = { number: 25100000, timestamp: Math.floor(Date.now() / 1000) };
  }

  const baseLatestNum = latestBaseBlock.number;
  const baseLatestTime = latestBaseBlock.timestamp;
  const ethLatestNum = latestEthBlock.number;
  const ethLatestTime = latestEthBlock.timestamp;

  // Adjust start blocks if they exceed current latest blocks
  const baseStart = Math.min(BASE_START_BLOCK, baseLatestNum);
  const ethStart = Math.min(ETH_START_BLOCK, ethLatestNum);

  // 2. Perform the scans concurrently
  const [baseData, ethData] = await Promise.all([
    scanChain({
      provider: baseProvider,
      usdcAddress: BASE_USDC,
      startBlock: baseStart,
      chainName: "base",
      latestBlock: baseLatestNum,
      latestTimestamp: baseLatestTime,
      blockTime: 2, // 2s per block on Base
    }),
    scanChain({
      provider: ethProvider,
      usdcAddress: ETH_USDC,
      startBlock: ethStart,
      chainName: "ethereum",
      latestBlock: ethLatestNum,
      latestTimestamp: ethLatestTime,
      blockTime: 12, // 12s per block on Ethereum
    }),
  ]);

  const totalUniqueWallets = new Set([
    ...baseData.uniqueWallets,
    ...ethData.uniqueWallets,
  ]);

  const totalUSDCDeposited = baseData.totalUSDC + ethData.totalUSDC;
  const CAPACITY = 2000000; // 2M capacity limit
  const remainingCap = Math.max(0, CAPACITY - totalUSDCDeposited);

  // Combine and sort all transactions chronologically
  const allTransfers = [...baseData.transfers, ...ethData.transfers].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // 3. Aggregate wallet history & data
  const walletMap = new Map();

  allTransfers.forEach((tx) => {
    if (!walletMap.has(tx.from)) {
      walletMap.set(tx.from, {
        address: tx.from,
        chains: new Set(),
        totalDeposits: 0,
        totalUSDC: 0,
        firstDeposit: tx.date,
        lastDeposit: tx.date,
        history: [],
      });
    }

    const wallet = walletMap.get(tx.from);
    wallet.chains.add(tx.chain);
    wallet.totalDeposits += 1;
    wallet.totalUSDC += tx.amount;
    wallet.lastDeposit = tx.date;
    wallet.history.push({
      txHash: tx.txHash,
      chain: tx.chain,
      amount: tx.amount,
      blockNumber: tx.blockNumber,
      date: tx.date,
    });
  });

  // Convert wallet map to sorted array
  const wallets = Array.from(walletMap.values()).map((w) => ({
    ...w,
    chains: Array.from(w.chains),
    history: w.history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), // sorted latest first
  })).sort((a, b) => b.totalUSDC - a.totalUSDC); // sorted richest first for leaderboard

  // 4. Compute Daily Growth Stats
  const growthMap = new Map();
  let cumBase = 0;
  let cumEth = 0;

  allTransfers.forEach((tx) => {
    const date = tx.date;
    if (!growthMap.has(date)) {
      growthMap.set(date, { date, baseUSDC: 0, ethUSDC: 0 });
    }
    const day = growthMap.get(date);
    if (tx.chain === "base") {
      day.baseUSDC += tx.amount;
    } else {
      day.ethUSDC += tx.amount;
    }
  });

  // Sort dates chronologically and aggregate cumulatively
  const sortedDates = Array.from(growthMap.keys()).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  const growthData = sortedDates.map((date) => {
    const day = growthMap.get(date);
    cumBase += day.baseUSDC;
    cumEth += day.ethUSDC;
    return {
      date,
      baseUSDC: Number(cumBase.toFixed(2)),
      ethUSDC: Number(cumEth.toFixed(2)),
      totalUSDC: Number((cumBase + cumEth).toFixed(2)),
    };
  });

  // Build the unified Dashboard Data object
  const dashboardData = {
    totalUniqueDepositors: totalUniqueWallets.size,
    totalDeposits: allTransfers.length,
    totalUSDCDeposited: Number(totalUSDCDeposited.toFixed(2)),
    remainingCap: Number(remainingCap.toFixed(2)),
    lastUpdated: new Date().toISOString(),
    chains: {
      base: {
        uniqueDepositors: baseData.uniqueWallets.size,
        deposits: baseData.totalTransfers,
        totalUSDC: Number(baseData.totalUSDC.toFixed(2)),
      },
      ethereum: {
        uniqueDepositors: ethData.uniqueWallets.size,
        deposits: ethData.totalTransfers,
        totalUSDC: Number(ethData.totalUSDC.toFixed(2)),
      },
    },
    wallets,
    growthData,
  };

  // Ensure target folder exists
  const targetDir = path.dirname("src/data/dashboard-data.json");
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Save JSON
  fs.writeFileSync(
    "src/data/dashboard-data.json",
    JSON.stringify(dashboardData, null, 2)
  );
  console.log("Saved dashboard data to src/data/dashboard-data.json");

  // Save legacy CSV
  fs.writeFileSync(
    "all-wallets.csv",
    [...totalUniqueWallets].join("\n")
  );
  console.log("Saved unique wallets to all-wallets.csv");

  return dashboardData;
}

// Execution check
if (process.argv[1] && (process.argv[1].endsWith("multichain.js") || process.argv[1].endsWith("multichain"))) {
  runScan().then(() => {
    console.log("Scanning process completed successfully!");
  }).catch((err) => {
    console.error("Scan execution failed:", err);
  });
}