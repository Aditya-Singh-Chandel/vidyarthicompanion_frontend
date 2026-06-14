'use client';

import React from 'react';
import {
  Sparkles,
  PartyPopper,
  PiggyBank,
  Soup,
  ThumbsDown,
  Star,
  Loader2,
} from 'lucide-react';
import { formatINR } from './pocketMeta';

const SCENARIO = {
  treat: {
    Icon: PartyPopper,
    card: 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50',
    iconWrap: 'bg-emerald-100 text-emerald-700',
    title: 'text-emerald-900',
  },
  conserve: {
    Icon: PiggyBank,
    card: 'border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50',
    iconWrap: 'bg-amber-100 text-amber-700',
    title: 'text-amber-900',
  },
  neutral: {
    Icon: Sparkles,
    card: 'border-gray-200 bg-white',
    iconWrap: 'bg-indigo-100 text-indigo-700',
    title: 'text-gray-900',
  },
};

export default function RecommendationCard({ rec, loading }) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white p-6 text-sm text-gray-400 shadow-sm">
        <Loader2 className="h-4 w-4 animate-spin" /> Reading your Mess community &amp; budget…
      </div>
    );
  }
  if (!rec) return null;

  const s = SCENARIO[rec.scenario] || SCENARIO.neutral;
  const Icon = s.Icon;
  const messPoor = rec.mess?.quality === 'poor';

  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${s.card}`}>
      <div className="flex items-start gap-4">
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${s.iconWrap}`}>
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wide text-gray-500">
              Wallet vs Wellness
            </span>
            {messPoor && (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                <ThumbsDown className="h-3 w-3" /> Mess downvoted
              </span>
            )}
          </div>
          <h3 className={`mt-0.5 text-base font-bold ${s.title}`}>{rec.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-gray-600">{rec.message}</p>

          {/* Suggested crowdsourced spot (treat scenario) */}
          {rec.suggestion && (
            <div className="mt-3 flex items-center justify-between rounded-xl border border-emerald-200 bg-white/70 px-3 py-2.5">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="truncate text-sm font-semibold text-gray-900">{rec.suggestion.name}</span>
                </div>
                <span className="text-xs capitalize text-gray-500">
                  {rec.suggestion.category}
                  {rec.suggestion.crowdsourced ? ' · campus favourite' : ''}
                </span>
              </div>
              <span className="shrink-0 text-sm font-bold text-emerald-700">
                ~{formatINR(rec.suggestion.averageCost)}
              </span>
            </div>
          )}

          {rec.scenario === 'conserve' && (
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-white/70 px-3 py-1.5 text-xs font-medium text-amber-800">
              <Soup className="h-3.5 w-3.5" /> Dorm Maggi &amp; free club snacks keep you on budget.
            </div>
          )}

          {/* Budget context footer */}
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-500">
            <span>Balance {formatINR(rec.balance)}</span>
            {rec.runwayDays != null && <span>· {rec.runwayDays}-day runway</span>}
            {rec.mess?.nodeCount > 0 && (
              <span>
                · Mess signal: {rec.mess.rejected} flag(s) / {rec.mess.verified} confirm(s)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
