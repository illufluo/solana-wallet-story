import { NextRequest, NextResponse } from 'next/server';
import { analyzeWalletTransactions, calculateFrictionMetrics } from '@/lib/solana-analyzer';
import { batchGenerateNarratives } from '@/lib/llm-narrator';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get('address');
    const limit = parseInt(searchParams.get('limit') || '50');
    const withNarrative = searchParams.get('narrative') === 'true';
    
    if (!address) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }
    
    // Validate address format (basic check)
    if (address.length < 32 || address.length > 44) {
      return NextResponse.json(
        { error: 'Invalid Solana address format' },
        { status: 400 }
      );
    }
    
    // Analyze transactions
    let transactions = await analyzeWalletTransactions(address, limit);
    
    // Optionally generate AI narratives
    if (withNarrative && transactions.length > 0) {
      transactions = await batchGenerateNarratives(transactions, 10);
    }
    
    // Calculate friction metrics
    const frictionMetrics = calculateFrictionMetrics(transactions);
    
    // Calculate overall stats
    const stats = {
      totalTransactions: transactions.length,
      successRate: frictionMetrics.successRate,
      totalFees: transactions.reduce((sum, tx) => sum + tx.fee, 0),
      avgFee: transactions.length > 0 
        ? transactions.reduce((sum, tx) => sum + tx.fee, 0) / transactions.length 
        : 0,
      avgInstructions: frictionMetrics.avgComplexity,
      failedTransactions: transactions.filter(tx => !tx.success).length
    };
    
    return NextResponse.json({
      address,
      transactions,
      stats,
      frictionMetrics
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze wallet',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
