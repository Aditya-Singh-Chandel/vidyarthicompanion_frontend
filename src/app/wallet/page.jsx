'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import WalletOverview from '@/features/pocketBuddy/WalletOverview';
import RecommendationCard from '@/features/pocketBuddy/RecommendationCard';
import SpendingBreakdown from '@/features/pocketBuddy/SpendingBreakdown';
import TransactionFeed from '@/features/pocketBuddy/TransactionFeed';
import CaptureTransaction from '@/features/pocketBuddy/CaptureTransaction';
import {
  getWalletSummary,
  getTransactions,
  getRecommendation,
  ingestTransaction,
  tagTransaction,
} from '@/features/pocketBuddy/pocketApi';

export default function WalletPage() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [recommendation, setRecommendation] = useState(null);
  const [recLoading, setRecLoading] = useState(true);
  const [lastAlert, setLastAlert] = useState(null);

  const refresh = useCallback(async () => {
    const [s, t] = await Promise.all([getWalletSummary(), getTransactions({ limit: 40 })]);
    setSummary(s);
    setTransactions(t);
    // Recommendation depends on fresh balances/consensus; fetch alongside.
    getRecommendation().then((r) => {
      setRecommendation(r);
      setRecLoading(false);
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [s, t, r] = await Promise.all([
        getWalletSummary(),
        getTransactions({ limit: 40 }),
        getRecommendation(),
      ]);
      if (cancelled) return;
      setSummary(s);
      setTransactions(t);
      setRecommendation(r);
      setRecLoading(false);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCapture = async (payload) => {
    const res = await ingestTransaction(payload);
    if (res) {
      setLastAlert(res.alert || null);
      await refresh();
      return true;
    }
    return false;
  };

  const handleTag = async (txnId, category) => {
    await tagTransaction(txnId, category);
    await refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">PocketBuddy</h1>
          <p className="mt-1 text-sm text-gray-500">
            Passive transaction tracking, crowdsourced merchant tags, and wallet-vs-wellness nudges.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center rounded-2xl border border-gray-200 bg-white py-24 text-sm text-gray-400 shadow-sm">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Syncing your wallet…
          </div>
        ) : (
          <>
            {lastAlert && (
              <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
                {lastAlert}
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
              {/* Left column */}
              <div className="space-y-6 lg:col-span-3">
                <WalletOverview summary={summary} />
                <RecommendationCard rec={recommendation} loading={recLoading} />
                <TransactionFeed transactions={transactions} onTag={handleTag} />
              </div>

              {/* Right column */}
              <div className="space-y-6 lg:col-span-2">
                <CaptureTransaction onCapture={handleCapture} />
                <SpendingBreakdown
                  breakdown={summary?.categoryBreakdown || []}
                  spentThisMonth={summary?.spentThisMonth || 0}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
