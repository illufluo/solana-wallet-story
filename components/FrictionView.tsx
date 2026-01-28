'use client';

import { TransactionAnalysis } from '@/types/solana';
import { FrictionMetrics } from '@/types/solana';

interface FrictionViewProps {
  transactions: TransactionAnalysis[];
  metrics: FrictionMetrics;
}

export default function FrictionView({ transactions, metrics }: FrictionViewProps) {
  // Calculate distribution by transaction type
  const typeDistribution = transactions.reduce((acc, tx) => {
    acc[tx.type] = (acc[tx.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate complexity buckets
  const complexityBuckets = {
    simple: transactions.filter(tx => tx.instructions <= 2).length,
    moderate: transactions.filter(tx => tx.instructions > 2 && tx.instructions <= 5).length,
    complex: transactions.filter(tx => tx.instructions > 5 && tx.instructions <= 10).length,
    veryComplex: transactions.filter(tx => tx.instructions > 10).length
  };

  // Calculate fee buckets (in SOL)
  const feeBuckets = {
    low: transactions.filter(tx => tx.fee / 1e9 < 0.00001).length,
    medium: transactions.filter(tx => tx.fee / 1e9 >= 0.00001 && tx.fee / 1e9 < 0.0001).length,
    high: transactions.filter(tx => tx.fee / 1e9 >= 0.0001).length
  };

  const getFrictionScore = () => {
    // Higher is worse (more friction)
    const failureScore = (100 - metrics.successRate) * 0.4;
    const complexityScore = Math.min(metrics.avgComplexity * 5, 40);
    const costScore = Math.min(metrics.totalCost * 1000, 20);
    
    return failureScore + complexityScore + costScore;
  };

  const frictionScore = getFrictionScore();
  const frictionLevel = 
    frictionScore < 20 ? { label: 'Low', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' } :
    frictionScore < 50 ? { label: 'Moderate', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30' } :
    { label: 'High', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' };

  return (
    <div className="space-y-6">
      {/* Overall Friction Score */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Overall Friction Assessment
        </h3>
        <div className="flex items-center gap-4">
          <div className={`text-5xl font-bold ${frictionLevel.color}`}>
            {frictionScore.toFixed(0)}
          </div>
          <div>
            <div className={`text-2xl font-semibold ${frictionLevel.color}`}>
              {frictionLevel.label} Friction
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Based on success rate, complexity, and cost
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Success Rate</div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
            {metrics.successRate.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {transactions.filter(tx => tx.success).length} / {transactions.length} succeeded
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Avg Complexity</div>
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
            {metrics.avgComplexity.toFixed(1)}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            instructions per transaction
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Total Cost</div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            {metrics.totalCost.toFixed(4)}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">
            SOL spent on fees
          </div>
        </div>
      </div>

      {/* Transaction Type Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">Transaction Types</h4>
        <div className="space-y-3">
          {Object.entries(typeDistribution)
            .sort(([, a], [, b]) => b - a)
            .map(([type, count]) => {
              const percentage = (count / transactions.length) * 100;
              return (
                <div key={type}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300">{type}</span>
                    <span className="text-gray-600 dark:text-gray-400">{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Complexity Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">Complexity Distribution</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{complexityBuckets.simple}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Simple (≤2)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{complexityBuckets.moderate}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Moderate (3-5)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{complexityBuckets.complex}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Complex (6-10)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{complexityBuckets.veryComplex}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Very Complex (&gt;10)</div>
          </div>
        </div>
      </div>

      {/* Fee Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">Fee Distribution</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{feeBuckets.low}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Low (&lt;0.00001 SOL)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{feeBuckets.medium}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Medium (0.00001-0.0001)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{feeBuckets.high}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">High (≥0.0001 SOL)</div>
          </div>
        </div>
      </div>

      {/* Failure Reasons */}
      {Object.keys(metrics.failureReasons).length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
          <h4 className="font-semibold mb-4 text-red-900 dark:text-red-300">Failure Analysis</h4>
          <div className="space-y-2">
            {Object.entries(metrics.failureReasons)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([reason, count]) => (
                <div key={reason} className="flex justify-between text-sm">
                  <span className="text-red-800 dark:text-red-200 font-mono text-xs truncate max-w-xs">
                    {reason}
                  </span>
                  <span className="text-red-700 dark:text-red-300 font-semibold">{count}x</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
