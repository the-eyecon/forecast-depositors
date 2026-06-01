import { ethers } from "ethers";
import fs from "fs";

const provider = new ethers.JsonRpcProvider(
  "https://mainnet.base.org"
);

const USDC_ADDRESS =
  "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913";

const DEPOSIT_ADDRESS =
  "0xf605767bb0636fe082b20b2999a6957e3c772378";

const START_BLOCK = 45903056;

const abi = [
  "event Transfer(address indexed from, address indexed to, uint256 value)"
];

const CHUNK_SIZE = 10000;

async function main() {
  const usdc = new ethers.Contract(
    USDC_ADDRESS,
    abi,
    provider
  );

  const latestBlock = await provider.getBlockNumber();

  console.log("Latest block:", latestBlock);

  const uniqueWallets = new Set();
  let totalTransfers = 0;
  let totalUSDC = 0;

  for (
    let fromBlock = START_BLOCK;
    fromBlock <= latestBlock;
    fromBlock += CHUNK_SIZE
  ) {
    const toBlock = Math.min(
      fromBlock + CHUNK_SIZE - 1,
      latestBlock
    );

    console.log(`Scanning ${fromBlock} -> ${toBlock}`);

    try {
      const events = await usdc.queryFilter(
        usdc.filters.Transfer(
          null,
          DEPOSIT_ADDRESS
        ),
        fromBlock,
        toBlock
      );

      totalTransfers += events.length;

      for (const event of events) {
        uniqueWallets.add(
          event.args.from.toLowerCase()
        );

        totalUSDC += Number(
          ethers.formatUnits(event.args.value, 6)
        );
      }

      console.log(
        `Transfers: ${totalTransfers} | Unique Wallets: ${uniqueWallets.size}`
      );
    } catch (err) {
      console.error(
        `Failed ${fromBlock}-${toBlock}`,
        err.message
      );
    }
  }

  console.log("\n========== RESULTS ==========");
  console.log(
    "Unique Depositors:",
    uniqueWallets.size
  );
  console.log(
    "Total Deposit Transactions:",
    totalTransfers
  );
  console.log(
    "Total USDC Deposited:",
    totalUSDC.toFixed(2)
  );

  const wallets = [...uniqueWallets];

  fs.writeFileSync(
  "wallets.csv",
  [...uniqueWallets].join("\n")
);

  console.log("wallets.csv created");

  console.log("\nSample Wallets:");
  console.log(wallets.slice(0, 20));
}

main().catch(console.error);