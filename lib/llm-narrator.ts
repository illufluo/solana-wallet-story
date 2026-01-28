import { TransactionAnalysis } from '@/types/solana';

const API_KEY = process.env.ZHIPU_API_KEY || '';
const BASE_URL = process.env.ZHIPU_BASE_URL || '';
const MODEL = process.env.ZHIPU_MODEL || 'glm4.7';

export async function generateNarrative(tx: TransactionAnalysis): Promise<string | null> {
  // If no API key, skip
  if (!API_KEY || !BASE_URL) {
    return null;
  }
  
  try {
    const prompt = `You are analyzing a Solana blockchain transaction. Generate a SHORT (1-2 sentences) human-friendly narrative.

Transaction Details:
- Type: ${tx.type}
- Success: ${tx.success ? 'Yes' : 'No'}
- Instructions: ${tx.instructions}
- Fee: ${(tx.fee / 1e9).toFixed(6)} SOL
- Description: ${tx.description}
${tx.error ? `- Error: ${tx.error}` : ''}

Generate a brief, friendly explanation of what happened. Focus on the user's perspective, not technical details.`;

    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 100,
        temperature: 0.7
      })
    });
    
    if (!response.ok) {
      console.error('LLM API error:', response.status, await response.text());
      return null;
    }
    
    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (error) {
    console.error('Error generating narrative:', error);
    return null; // Graceful fallback
  }
}

export async function batchGenerateNarratives(
  transactions: TransactionAnalysis[],
  maxCount: number = 10
): Promise<TransactionAnalysis[]> {
  // Only generate narratives for the most recent transactions
  const txsToNarrate = transactions.slice(0, maxCount);
  const remainingTxs = transactions.slice(maxCount);
  
  const narrativePromises = txsToNarrate.map(async (tx) => {
    const narrative = await generateNarrative(tx);
    return { ...tx, narrative };
  });
  
  try {
    // Generate narratives with a timeout
    const timeoutPromise = new Promise<TransactionAnalysis[]>((_, reject) => 
      setTimeout(() => reject(new Error('Narrative generation timeout')), 15000)
    );
    
    const narratedTxs = await Promise.race([
      Promise.all(narrativePromises),
      timeoutPromise
    ]);
    
    return [...narratedTxs, ...remainingTxs];
  } catch (error) {
    console.error('Batch narrative generation failed:', error);
    // Return original transactions without narratives
    return transactions;
  }
}
