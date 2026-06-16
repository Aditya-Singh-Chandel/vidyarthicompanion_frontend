'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, Wallet, TrendingUp, Sparkles, Zap } from 'lucide-react';
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
    <div className="min-h-screen p-4 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 cf-page-enter">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--brand-3)]/15 to-[var(--brand)]/15">
              <Wallet className="h-5 w-5 text-[var(--brand-3)]" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">PocketBuddy</h1>
            <span className="flex items-center gap-1 text-[10px] font-semibold text-[var(--brand-3)] bg-[var(--brand-3)]/8 px-2.5 py-1 rounded-full border border-[var(--brand-3)]/15">
              <TrendingUp className="h-3 w-3" /> Smart Budgets
            </span>
          </div>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Transaction tracking, AI-powered spending insights, and wallet-vs-wellness nudges.
          </p>
        </header>

        {loading ? (
          <div className="flex items-center justify-center rounded-[var(--radius-2xl)] border border-white/60 bg-white/50 py-24 text-sm text-gray-400 backdrop-blur-md shadow-[var(--shadow-float)]">
            <Loader2 className="mr-2 h-5 w-5 animate-spin text-[var(--brand)]" /> Syncing your wallet…
          </div>
        ) : (
          <>
            {lastAlert && (
              <div className="mb-6 rounded-xl border border-amber-200/60 bg-amber-50/60 px-4 py-3 text-sm font-medium text-amber-800 backdrop-blur-md animate-slide-up-fade">
                <Zap className="inline h-4 w-4 mr-1.5 text-amber-600" />
                {lastAlert}
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
              {/* Left column */}
              <div className="space-y-6 lg:col-span-3">
                <div className="widget-card p-5">
                  <WalletOverview summary={summary} />
                </div>
                <div className="widget-card p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-4 w-4 text-[var(--brand)]" />
                    <span className="section-label">AI Recommendation</span>
                  </div>
                  <RecommendationCard rec={recommendation} loading={recLoading} />
                </div>
                <div className="widget-card p-5">
                  <TransactionFeed transactions={transactions} onTag={handleTag} />
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-6 lg:col-span-2">
                <div className="widget-card p-5">
                  <CaptureTransaction onCapture={handleCapture} />
                </div>
                <div className="widget-card p-5">
                  <SpendingBreakdown
                    breakdown={summary?.categoryBreakdown || []}
                    spentThisMonth={summary?.spentThisMonth || 0}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
