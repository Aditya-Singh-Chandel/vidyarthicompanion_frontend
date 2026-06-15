'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  PartyPopper,
  PiggyBank,
  Home,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { getRecommendation } from './pocketApi';

/**
 * Compact dashboard surface for the Wallet-vs-Wellness nudge. Shows a one-line
 * summary in a small notification-style box and links to PocketBuddy, where the
 * full recommendation card lives — so the complete card isn't duplicated.
 */
const SCENARIO = {
  eat_in: { Icon: Home, iconWrap: 'bg-emerald-100 text-emerald-700' },
  treat: { Icon: PartyPopper, iconWrap: 'bg-violet-100 text-violet-700' },
  conserve: { Icon: PiggyBank, iconWrap: 'bg-amber-100 text-amber-700' },
  neutral: { Icon: Sparkles, iconWrap: 'bg-indigo-100 text-indigo-700' },
};

export default function DashboardRecommendation() {
  const [rec, setRec] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const r = await getRecommendation();
      if (cancelled) return;
      setRec(r);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const s = SCENARIO[rec?.scenario] || SCENARIO.neutral;
  const Icon = s.Icon;

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-indigo-600" />
        <h3 className="text-sm font-bold uppercase tracking-wide text-indigo-800">Recommendation</h3>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-2 text-sm text-gray-400">
          <Loader2 className="h-4 w-4 animate-spin" /> Reading your Mess &amp; budget…
        </div>
      ) : !rec ? (
        <p className="text-xs text-gray-400">No recommendation yet. Set your Mess community in Profile.</p>
      ) : (
        <div className="flex items-start gap-3">
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${s.iconWrap}`}>
            <Icon className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-900">{rec.title}</p>
            <p className="mt-0.5 line-clamp-2 text-xs text-gray-500">{rec.message}</p>
            <Link
              href="/wallet"
              className="mt-2 inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
            >
              View in PocketBuddy <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
