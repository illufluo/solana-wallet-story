'use client';

import { TransactionAnalysis } from '@/types/solana';

interface TransactionTimelineProps {
  transactions: TransactionAnalysis[];
}

export default function TransactionTimeline({ transactions }: TransactionTimelineProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Transfer': return '💸';
      case 'Swap/DEX': return '🔄';
      case 'Staking': return '🏦';
      case 'NFT': return '🖼️';
      case 'Vote': return '🗳️';
      case 'Account Creation': return '✨';
      default: return '⚙️';
    }
  };

  const getStatusColor = (success: boolean) => {
    return success
      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        No transactions found for this wallet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((tx, index) => (
        <div
          key={tx.signature}
          className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-md transition-shadow bg-white dark:bg-gray-800/50"
        >
          <div className="flex items-start gap-4">
            {/* Timeline Icon */}
            <div className="flex-shrink-0">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${getStatusColor(tx.success)}`}>
                {getTypeIcon(tx.type)}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-semibold text-gray-900 dark:text-white">{tx.type}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tx.success)}`}>
                  {tx.success ? 'Success' : 'Failed'}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(tx.blockTime)}
                </span>
              </div>

              <p className="text-gray-700 dark:text-gray-300 mb-3">
                {tx.description}
              </p>

              {/* AI Narrative */}
              {tx.narrative && (
                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3 mb-3">
                  <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold mb-1">
                    🤖 AI Insight
                  </div>
                  <p className="text-sm text-purple-900 dark:text-purple-200">
                    {tx.narrative}
                  </p>
                </div>
              )}

              {/* Transaction Details */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div>
                  <span className="font-medium">Fee:</span> {(tx.fee / 1e9).toFixed(6)} SOL
                </div>
                <div>
                  <span className="font-medium">Instructions:</span> {tx.instructions}
                </div>
                <div>
                  <span className="font-medium">Slot:</span> {tx.slot.toLocaleString()}
                </div>
              </div>

              {/* Error Message */}
              {!tx.success && tx.error && (
                <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 rounded text-xs text-red-700 dark:text-red-300 font-mono overflow-x-auto">
                  {tx.error}
                </div>
              )}

              {/* Signature (collapsible) */}
              <details className="mt-3">
                <summary className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer hover:text-purple-600 dark:hover:text-purple-400">
                  View signature
                </summary>
                <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-900 rounded text-xs font-mono break-all text-gray-700 dark:text-gray-300">
                  {tx.signature}
                </div>
              </details>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
