'use client';

import React, { useState } from 'react';
import { Wallet, PiggyBank, Utensils, Dumbbell, Loader2, Check } from 'lucide-react';
import { formatINR } from '@/features/pocketBuddy/pocketMeta';
import { updateFinancial } from './profileApi';

export default function FinancialSetup({ profile, onSaved }) {
  const [monthlyBudget, setMonthlyBudget] = useState(profile?.financial?.monthlyBudget ?? 8000);
  const [safeBufferPct, setSafeBufferPct] = useState(profile?.financial?.safeBufferPct ?? 0);
  const [primaryMessNodeId, setPrimaryMessNodeId] = useState(profile?.primaryMessNodeId ?? '');
  const [primaryGymNodeId, setPrimaryGymNodeId] = useState(profile?.primaryGymNodeId ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const messCommunities = profile?.messCommunities ?? [];
  const gymCommunities = profile?.gymCommunities ?? [];
  const effective = Math.round(monthlyBudget * (1 - safeBufferPct / 100));

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    const res = await updateFinancial({
      monthlyBudget: Number(monthlyBudget),
      safeBufferPct: Number(safeBufferPct),
      primaryMessNodeId: primaryMessNodeId || null,
      primaryGymNodeId: primaryGymNodeId || null,
    });
    setSaving(false);
    if (res) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      onSaved?.(res);
    }
  };

  return (
    <div className="space-y-6">
      {/* Monthly budget */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Wallet className="h-4 w-4 text-indigo-600" /> Monthly budget goal
          </label>
          <span className="text-lg font-black text-gray-900">{formatINR(monthlyBudget)}</span>
        </div>
        <input
          type="range"
          min="1000"
          max="30000"
          step="500"
          value={monthlyBudget}
          onChange={(e) => setMonthlyBudget(Number(e.target.value))}
          className="w-full accent-indigo-600"
        />
        <div className="mt-2">
          <input
            type="number"
            min="100"
            value={monthlyBudget}
            onChange={(e) => setMonthlyBudget(Number(e.target.value))}
            className="w-40 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
          <span className="ml-2 text-xs text-gray-400">your hard ceiling</span>
        </div>
      </div>

      {/* Safe buffer */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700">
            <PiggyBank className="h-4 w-4 text-emerald-600" /> Safe buffer (forced savings)
          </label>
          <span className="text-sm font-bold text-emerald-700">{safeBufferPct}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="50"
          step="5"
          value={safeBufferPct}
          onChange={(e) => setSafeBufferPct(Number(e.target.value))}
          className="w-full accent-emerald-600"
        />
        <p className="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
          The AI hides {safeBufferPct}% of your budget. Spendable this month:{' '}
          <span className="font-bold">{formatINR(effective)}</span>.
        </p>
      </div>

      {/* Primary communities */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Utensils className="h-4 w-4 text-amber-600" /> Primary Mess community
          </label>
          <select
            value={primaryMessNodeId}
            onChange={(e) => setPrimaryMessNodeId(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="">None selected</option>
            {messCommunities.map((c) => (
              <option key={c.nodeId} value={c.nodeId}>
                {c.name}
              </option>
            ))}
          </select>
          {messCommunities.length === 0 && (
            <p className="mt-1 text-[11px] text-gray-400">Join a Mess community to enable food nudges.</p>
          )}
        </div>
        <div>
          <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Dumbbell className="h-4 w-4 text-indigo-600" /> Primary Gym community
          </label>
          <select
            value={primaryGymNodeId}
            onChange={(e) => setPrimaryGymNodeId(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="">None selected</option>
            {gymCommunities.map((c) => (
              <option key={c.nodeId} value={c.nodeId}>
                {c.name}
              </option>
            ))}
          </select>
          {gymCommunities.length === 0 && (
            <p className="mt-1 text-[11px] text-gray-400">Join a Gym community for protein/fuel tips.</p>
          )}
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : null}
        {saved ? 'Saved' : 'Save financial settings'}
      </button>
    </div>
  );
}
