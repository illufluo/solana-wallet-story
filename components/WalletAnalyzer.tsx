'use client';

import { useState } from 'react';
import { WalletAnalysis } from '@/types/solana';
import TransactionTimeline from './TransactionTimeline';
import FrictionView from './FrictionView';

interface WalletAnalyzerProps {
  defaultAddress?: string;
}

export default function WalletAnalyzer({ defaultAddress = '' }: WalletAnalyzerProps) {
  const [address, setAddress] = useState(defaultAddress);
  const [inputAddress, setInputAddress] = useState(defaultAddress);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<WalletAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<'timeline' | 'friction'>('timeline');
  const [withNarrative, setWithNarrative] = useState(false);

  const analyzeWallet = async () => {
    if (!inputAddress.trim()) {
      setError('Please enter a wallet address');
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(
        `/api/analyze?address=${encodeURIComponent(inputAddress)}&limit=50&narrative=${withNarrative}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze wallet');
      }

      const result = await response.json();
      setData(result);
      setAddress(inputAddress);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      analyzeWallet();
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
        <div className="flex flex-col gap-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputAddress}
              onChange={(e) => setInputAddress(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter Solana wallet address..."
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={analyzeWallet}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="narrative"
              checked={withNarrative}
              onChange={(e) => setWithNarrative(e.target.checked)}
              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
            />
            <label htmlFor="narrative" className="text-sm text-gray-600 dark:text-gray-300">
              Generate AI narratives (slower, but more insightful)
            </label>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
            {error}
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Fetching on-chain data...</p>
        </div>
      )}

      {/* Results */}
      {data && !loading && (
        <div>
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Transactions</div>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {data.stats.totalTransactions}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Success Rate</div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {data.stats.successRate.toFixed(1)}%
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Fees</div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {(data.stats.totalFees / 1e9).toFixed(4)} SOL
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Avg Complexity</div>
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {data.stats.avgInstructions.toFixed(1)}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('timeline')}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'timeline'
                    ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-b-2 border-purple-600'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                📜 Transaction Timeline
              </button>
              <button
                onClick={() => setActiveTab('friction')}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'friction'
                    ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-b-2 border-purple-600'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                ⚡ Friction Analysis
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'timeline' && <TransactionTimeline transactions={data.transactions} />}
              {activeTab === 'friction' && (
                <FrictionView 
                  transactions={data.transactions}
                  metrics={data.frictionMetrics}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
