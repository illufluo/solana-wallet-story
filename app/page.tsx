'use client';

import { useState } from 'react';
import WalletAnalyzer from '@/components/WalletAnalyzer';

export default function Home() {
  const [defaultAddress] = useState('EaPKB85tWK6Dt4vhRTR9snZtiV8jckndTRh71xo2bUDN');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent mb-4">
            Solana Wallet Story
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Understand your Solana on-chain activity through an intuitive timeline and friction analysis
          </p>
        </header>
        
        <WalletAnalyzer defaultAddress={defaultAddress} />
      </div>
    </div>
  );
}
