'use client';

import React from 'react';
import { Wallet, TrendingDown, CalendarDays, Gauge } from 'lucide-react';
import { formatINR } from './pocketMeta';

/**
 * The headline wallet card: live balance, a "runway" gauge (how many days the
 * money lasts at the current spend rate), and a monthly-budget progress bar.
 */
export default function WalletOverview({ summary }) {
  if (!summary) return null;

  const {
    balance,
    monthlyBudget,
    spentThisMonth,
    daysLeftInMonth,
    runwayDays,
    avgDailySpend,
    isCritical,
  } = summary;

  const spentPct = monthlyBudget > 0 ? Math.min(Math.round((spentThisMonth / monthlyBudget) * 100), 100) : 0;

  // Runway: lasts the month if it covers the days remaining.
  const lastsMonth = runwayDays == null || runwayDays >= daysLeftInMonth;
  const runwayPct =
    runwayDays == null ? 100 : Math.min(Math.round((runwayDays / Math.max(daysLeftInMonth, 1)) * 100), 100);
  const runwayColor = lastsMonth ? 'bg-emerald-500' : runwayDays <= 3 ? 'bg-rose-500' : 'bg-amber-500';

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Balance header */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 text-white">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-indigo-100">
          <Wallet className="h-4 w-4" /> Amazon Pay balance
        </div>
        <p className={`mt-1 text-4xl font-black tracking-tight ${isCritical ? 'text-rose-200' : 'text-white'}`}>
          {formatINR(balance)}
        </p>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-indigo-100">
          <span className="inline-flex items-center gap-1">
            <TrendingDown className="h-3.5 w-3.5" /> {formatINR(avgDailySpend)}/day avg
          </span>
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" /> {daysLeftInMonth} days left this month
          </span>
        </div>
      </div>

      <div className="space-y-5 p-6">
        {/* Runway gauge */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-700">
              <Gauge className="h-4 w-4 text-indigo-600" /> Runway
            </span>
            <span className={`text-sm font-bold ${lastsMonth ? 'text-emerald-600' : 'text-amber-600'}`}>
              {runwayDays == null ? 'Plenty' : `${runwayDays} day${runwayDays === 1 ? '' : 's'}`}
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div className={`h-full rounded-full ${runwayColor} transition-all`} style={{ width: `${runwayPct}%` }} />
          </div>
          <p className="mt-1.5 text-xs text-gray-500">
            {runwayDays == null
              ? 'Spending is low — your balance comfortably covers the month.'
              : lastsMonth
              ? 'Your balance lasts through the end of the month at this rate.'
              : `At this rate your money runs out ${daysLeftInMonth - runwayDays} day(s) before month-end.`}
          </p>
        </div>

        {/* Monthly budget progress */}
        <div>
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="font-semibold text-gray-700">Spent this month</span>
            <span className="text-gray-500">
              {formatINR(spentThisMonth)} <span className="text-gray-300">/</span> {formatINR(monthlyBudget)}
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full transition-all ${spentPct >= 90 ? 'bg-rose-500' : 'bg-indigo-500'}`}
              style={{ width: `${spentPct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
