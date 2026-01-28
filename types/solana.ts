export interface TransactionAnalysis {
  signature: string;
  blockTime: number;
  slot: number;
  success: boolean;
  fee: number; // lamports
  instructions: number;
  type: string;
  description: string;
  narrative?: string | null; // AI-generated narrative
  accounts: string[];
  error?: string;
}

export interface WalletAnalysis {
  address: string;
  transactions: TransactionAnalysis[];
  stats: {
    totalTransactions: number;
    successRate: number;
    totalFees: number; // lamports
    avgFee: number;
    avgInstructions: number;
    failedTransactions: number;
  };
  frictionMetrics: FrictionMetrics;
}

export interface FrictionMetrics {
  successRate: number;
  avgComplexity: number; // avg instructions per tx
  totalCost: number; // in SOL
  failureReasons: { [key: string]: number };
}
