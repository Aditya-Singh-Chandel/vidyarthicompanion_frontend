'use client';

import React from 'react';
import { PieChart } from 'lucide-react';
import { categoryOf, formatINR } from './pocketMeta';

/**
 * Crowdsourced spend breakdown for the month. A segmented runway-style bar plus
 * a per-category legend — no boring pie charts.
 */
export default function SpendingBreakdown({ breakdown = [], spentThisMonth = 0 }) {
  const hasData = breakdown.length > 0 && spentThisMonth > 0;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="inline-flex items-center gap-2 text-sm font-bold text-gray-800">
          <PieChart className="h-4 w-4 text-indigo-600" /> Where it went
        </h3>
        <span className="text-xs text-gray-400">this month</span>
      </div>

      {!hasData ? (
        <p className="py-6 text-center text-sm text-gray-400">
          No spending tracked yet this month. Capture a payment to see your breakdown.
        </p>
      ) : (
        <>
          {/* Segmented bar */}
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-gray-100">
            {breakdown.map((b) => {
              const meta = categoryOf(b.category);
              return (
                <div
                  key={b.category}
                  className={meta.bar}
                  style={{ width: `${b.pct}%` }}
                  title={`${meta.label}: ${formatINR(b.total)}`}
                />
              );
            })}
          </div>

          {/* Legend */}
          <ul className="mt-4 space-y-2.5">
            {breakdown.map((b) => {
              const meta = categoryOf(b.category);
              const Icon = meta.Icon;
              return (
                <li key={b.category} className="flex items-center gap-3">
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${meta.chip}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="flex-1 text-sm font-medium text-gray-700">{meta.label}</span>
                  <span className="text-xs text-gray-400">{b.count}×</span>
                  <span className="w-20 text-right text-sm font-semibold text-gray-900">
                    {formatINR(b.total)}
                  </span>
                  <span className="w-10 text-right text-xs text-gray-400">{b.pct}%</span>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
