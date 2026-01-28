import { Connection, PublicKey, ParsedTransactionWithMeta } from '@solana/web3.js';
import { TransactionAnalysis } from '@/types/solana';

const RPC_URL = process.env.SOLANA_RPC || '';

// Simple rule-based transaction classifier
function classifyTransaction(tx: ParsedTransactionWithMeta): string {
  if (!tx.meta?.logMessages) return 'Unknown';
  
  const logs = tx.meta.logMessages.join(' ').toLowerCase();
  
  // Simple pattern matching
  if (logs.includes('transfer')) return 'Transfer';
  if (logs.includes('swap') || logs.includes('raydium') || logs.includes('jupiter')) return 'Swap/DEX';
  if (logs.includes('stake')) return 'Staking';
  if (logs.includes('nft') || logs.includes('metaplex')) return 'NFT';
  if (logs.includes('vote')) return 'Vote';
  if (logs.includes('create account')) return 'Account Creation';
  
  return 'Program Interaction';
}

// Generate a human-readable description
function generateDescription(tx: ParsedTransactionWithMeta, type: string): string {
  const instructionCount = tx.transaction.message.instructions.length;
  const success = tx.meta?.err === null;
  
  if (!success) {
    return `Failed ${type.toLowerCase()} with ${instructionCount} instruction(s)`;
  }
  
  switch (type) {
    case 'Transfer':
      return `Transferred SOL or tokens (${instructionCount} instruction(s))`;
    case 'Swap/DEX':
      return `Executed token swap on DEX (${instructionCount} instruction(s))`;
    case 'Staking':
      return `Staking operation (${instructionCount} instruction(s))`;
    case 'NFT':
      return `NFT transaction (${instructionCount} instruction(s))`;
    case 'Vote':
      return `Validator vote (${instructionCount} instruction(s))`;
    case 'Account Creation':
      return `Created new account(s) (${instructionCount} instruction(s))`;
    default:
      return `Interacted with Solana program(s) (${instructionCount} instruction(s))`;
  }
}

export async function analyzeWalletTransactions(
  address: string,
  limit: number = 50
): Promise<TransactionAnalysis[]> {
  try {
    const connection = new Connection(RPC_URL, 'confirmed');
    const pubkey = new PublicKey(address);
    
    // Fetch signatures first (lighter request)
    const signatures = await connection.getSignaturesForAddress(pubkey, { limit });
    
    if (signatures.length === 0) {
      return [];
    }
    
    // Fetch transactions in batches to avoid RPC limits
    const batchSize = 10;
    const transactions: TransactionAnalysis[] = [];
    
    for (let i = 0; i < signatures.length; i += batchSize) {
      const batch = signatures.slice(i, i + batchSize);
      const txPromises = batch.map(sig => 
        connection.getParsedTransaction(sig.signature, {
          maxSupportedTransactionVersion: 0
        })
      );
      
      const txResults = await Promise.all(txPromises);
      
      for (let j = 0; j < txResults.length; j++) {
        const tx = txResults[j];
        const sig = batch[j];
        
        if (!tx) continue;
        
        const type = classifyTransaction(tx);
        const success = tx.meta?.err === null;
        const fee = tx.meta?.fee || 0;
        const instructionCount = tx.transaction.message.instructions.length;
        
        // Extract account keys
        const accounts = tx.transaction.message.accountKeys.map(key => 
          typeof key === 'string' ? key : key.pubkey.toBase58()
        );
        
        transactions.push({
          signature: sig.signature,
          blockTime: sig.blockTime || 0,
          slot: sig.slot,
          success,
          fee,
          instructions: instructionCount,
          type,
          description: generateDescription(tx, type),
          accounts: accounts.slice(0, 5), // Limit to first 5 accounts
          error: sig.err ? JSON.stringify(sig.err) : undefined
        });
      }
      
      // Small delay between batches to be nice to RPC
      if (i + batchSize < signatures.length) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    return transactions.sort((a, b) => b.blockTime - a.blockTime);
  } catch (error) {
    console.error('Error analyzing wallet:', error);
    throw new Error(`Failed to analyze wallet: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function calculateFrictionMetrics(transactions: TransactionAnalysis[]) {
  if (transactions.length === 0) {
    return {
      successRate: 0,
      avgComplexity: 0,
      totalCost: 0,
      failureReasons: {}
    };
  }
  
  const successCount = transactions.filter(tx => tx.success).length;
  const totalFees = transactions.reduce((sum, tx) => sum + tx.fee, 0);
  const totalInstructions = transactions.reduce((sum, tx) => sum + tx.instructions, 0);
  
  const failureReasons: { [key: string]: number } = {};
  transactions.filter(tx => !tx.success).forEach(tx => {
    const reason = tx.error || 'Unknown Error';
    failureReasons[reason] = (failureReasons[reason] || 0) + 1;
  });
  
  return {
    successRate: (successCount / transactions.length) * 100,
    avgComplexity: totalInstructions / transactions.length,
    totalCost: totalFees / 1e9, // Convert lamports to SOL
    failureReasons
  };
}
