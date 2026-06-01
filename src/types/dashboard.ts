export interface DepositHistoryItem {
  txHash: string;
  chain: "base" | "ethereum";
  amount: number;
  blockNumber: number;
  date: string; // YYYY-MM-DD
}

export interface WalletData {
  address: string;
  chains: string[];
  totalDeposits: number;
  totalUSDC: number;
  firstDeposit: string; // YYYY-MM-DD
  lastDeposit: string; // YYYY-MM-DD
  history: DepositHistoryItem[];
}

export interface ChainStats {
  uniqueDepositors: number;
  deposits: number;
  totalUSDC: number;
}

export interface GrowthDataPoint {
  date: string;
  baseUSDC: number;
  ethUSDC: number;
  totalUSDC: number;
}

export interface DashboardData {
  totalUniqueDepositors: number;
  totalDeposits: number;
  totalUSDCDeposited: number;
  remainingCap: number;
  lastUpdated: string; // ISO String
  chains: {
    base: ChainStats;
    ethereum: ChainStats;
  };
  wallets: WalletData[];
  growthData: GrowthDataPoint[];
}
