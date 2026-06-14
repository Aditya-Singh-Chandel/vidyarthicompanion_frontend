'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  PartyPopper,
  PiggyBank,
  Home,
  Soup,
  ThumbsDown,
  ThumbsUp,
  Star,
  Dumbbell,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { formatINR } from './pocketMeta';

const SCENARIO = {
  eat_in: {
    Icon: Home,
    card: 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50',
    iconWrap: 'bg-emerald-100 text-emerald-700',
    title: 'text-emerald-900',
  },
  treat: {
    Icon: PartyPopper,
    card: 'border-violet-200 bg-gradient-to-br from-violet-50 to-indigo-50',
    iconWrap: 'bg-violet-100 text-violet-700',
    title: 'text-violet-900',
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
  const quality = rec.mess?.quality;
  const suggestions = rec.suggestions || [];

  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${s.card}`}>
      <div className="flex items-start gap-4">
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${s.iconWrap}`}>
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wide text-gray-500">Wallet vs Wellness</span>
            {quality === 'poor' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                <ThumbsDown className="h-3 w-3" /> Mess flagged ({rec.mess.netVotes})
              </span>
            )}
            {quality === 'good' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                <ThumbsUp className="h-3 w-3" /> Mess rated well (+{rec.mess.netVotes})
              </span>
            )}
          </div>
          <h3 className={`mt-0.5 text-base font-bold ${s.title}`}>{rec.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-gray-600">{rec.message}</p>

          {/* Crowdsourced spots (treat scenario) */}
          {suggestions.length > 0 && (
            <ul className="mt-3 space-y-2">
              {suggestions.map((sug, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-violet-200 bg-white/70 px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="truncate text-sm font-semibold text-gray-900">{sug.name}</span>
                    </div>
                    <span className="text-xs capitalize text-gray-500">
                      {sug.category}
                      {sug.crowdsourced ? ' · campus favourite' : ''}
                    </span>
                  </div>
                  <span className="shrink-0 text-sm font-bold text-violet-700">~{formatINR(sug.averageCost)}</span>
                </li>
              ))}
            </ul>
          )}

          {rec.scenario === 'conserve' && (
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-white/70 px-3 py-1.5 text-xs font-medium text-amber-800">
              <Soup className="h-3.5 w-3.5" /> Dorm Maggi &amp; free club snacks keep you on budget.
            </div>
          )}

          {rec.scenario === 'neutral' && (
            <Link
              href="/profile"
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
            >
              Set your Mess community <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}

          {/* Gym fuel tip */}
          {rec.gymFuel && (
            <div className="mt-3 rounded-xl border border-indigo-100 bg-indigo-50/60 px-3 py-2.5">
              <p className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700">
                <Dumbbell className="h-3.5 w-3.5" /> {rec.gymFuel.title}
              </p>
              <p className="mt-0.5 text-xs text-indigo-800">{rec.gymFuel.message}</p>
            </div>
          )}

          {/* Budget context footer */}
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-500">
            <span>Remaining {formatINR(rec.remainingBudget)}</span>
            {rec.runwayDays != null && <span>· {rec.runwayDays}-day runway</span>}
            {rec.mess?.nodeName && <span>· {rec.mess.nodeName}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
