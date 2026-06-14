'use client';

import React from 'react';
import { Wallet, TrendingDown, CalendarDays, Gauge, PiggyBank } from 'lucide-react';
import { formatINR } from './pocketMeta';

/**
 * Headline budget card. The PRIMARY metric is Remaining Budget for the month
 * = effective budget - spent this month. Runway = remaining / avg daily spend,
 * highlighted green when it lasts the month and red when it won't.
 */
export default function WalletOverview({ summary }) {
  if (!summary) return null;

  const {
    balance,
    monthlyBudget,
    effectiveBudget = monthlyBudget,
    safeBufferPct = 0,
    spentThisMonth,
    remainingBudget,
    daysLeftInMonth,
    runwayDays,
    onTrack,
    avgDailySpend,
  } = summary;

  const overspent = remainingBudget < 0;
  const spentPct =
    effectiveBudget > 0 ? Math.min(Math.round((spentThisMonth / effectiveBudget) * 100), 100) : 0;

  const runwayPct =
    runwayDays == null ? 100 : Math.min(Math.round((runwayDays / Math.max(daysLeftInMonth, 1)) * 100), 100);
  const runwayColor = onTrack ? 'bg-emerald-500' : runwayDays != null && runwayDays <= 3 ? 'bg-rose-500' : 'bg-amber-500';

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Remaining budget header (primary metric) */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-indigo-100">
            <Wallet className="h-4 w-4" /> Remaining this month
          </div>
          <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium text-indigo-50">
            Wallet {formatINR(balance)}
          </span>
        </div>
        <p className={`mt-1 text-4xl font-black tracking-tight ${overspent ? 'text-rose-200' : 'text-white'}`}>
          {formatINR(remainingBudget)}
        </p>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-indigo-100">
          <span className="inline-flex items-center gap-1">
            <TrendingDown className="h-3.5 w-3.5" /> {formatINR(avgDailySpend)}/day avg
          </span>
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" /> {daysLeftInMonth} days left
          </span>
          {safeBufferPct > 0 && (
            <span className="inline-flex items-center gap-1">
              <PiggyBank className="h-3.5 w-3.5" /> {safeBufferPct}% saved aside
            </span>
          )}
        </div>
      </div>

      <div className="space-y-5 p-6">
        {/* Runway gauge */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-700">
              <Gauge className="h-4 w-4 text-indigo-600" /> Runway
            </span>
            <span className={`text-sm font-bold ${onTrack ? 'text-emerald-600' : 'text-rose-600'}`}>
              {runwayDays == null ? 'Plenty' : `${runwayDays} day${runwayDays === 1 ? '' : 's'}`}
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div className={`h-full rounded-full ${runwayColor} transition-all`} style={{ width: `${runwayPct}%` }} />
          </div>
          <p className="mt-1.5 text-xs text-gray-500">
            {overspent
              ? 'You have crossed your spendable budget for the month.'
              : runwayDays == null
              ? 'Spending is low — your budget comfortably covers the month.'
              : onTrack
              ? 'On track — your budget lasts through the end of the month.'
              : `At this rate your budget runs out ${Math.max(daysLeftInMonth - runwayDays, 0)} day(s) before month-end.`}
          </p>
        </div>

        {/* Budget progress */}
        <div>
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="font-semibold text-gray-700">Spent this month</span>
            <span className="text-gray-500">
              {formatINR(spentThisMonth)} <span className="text-gray-300">/</span> {formatINR(effectiveBudget)}
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full transition-all ${spentPct >= 90 ? 'bg-rose-500' : 'bg-indigo-500'}`}
              style={{ width: `${spentPct}%` }}
            />
          </div>
          {safeBufferPct > 0 && (
            <p className="mt-1 text-[11px] text-gray-400">
              Spendable budget is {formatINR(effectiveBudget)} ({formatINR(monthlyBudget)} − {safeBufferPct}% buffer).
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
