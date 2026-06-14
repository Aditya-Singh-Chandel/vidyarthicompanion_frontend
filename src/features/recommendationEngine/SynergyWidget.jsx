'use client';

import React, { useState, useEffect } from 'react';
import { Zap, Pizza, Car, Users, Loader2 } from 'lucide-react';
import { getSynergies } from './recommendationApi';

const TYPE_ICON = { meal: Pizza, carpool: Car };

function SynergyCard({ synergy }) {
  const [requested, setRequested] = useState(false);
  const Icon = TYPE_ICON[synergy.type] || Zap;

  return (
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 shadow-sm">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-gray-900">{synergy.title}</p>
        <p className="mt-1 text-xs leading-relaxed text-gray-600">{synergy.detail}</p>
        <button
          disabled={requested}
          onClick={() => setRequested(true)}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 transition-all"
        >
          <Users className="h-4 w-4" />
          {requested
            ? `Request sent to ${synergy.partner?.name || 'partner'}`
            : `Tap to split ₹${synergy.amount} (₹${synergy.perHead} each)`}
        </button>
      </div>
    </div>
  );
}

export default function SynergyWidget() {
  const [loading, setLoading] = useState(true);
  const [synergies, setSynergies] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await getSynergies();
      if (cancelled) return;
      setSynergies(data);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 shadow-sm mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold uppercase tracking-wide text-indigo-800 flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Synergy Scanner
        </h3>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-4 text-sm text-gray-400">
          <Loader2 className="h-4 w-4 animate-spin" /> Scanning your community graph…
        </div>
      ) : synergies.length === 0 ? (
        <p className="text-xs text-gray-500">
          No synergies right now. Join more communities (carpool, fooding) to unlock cost-splits.
        </p>
      ) : (
        <div className="space-y-6">
          {synergies.map((s) => (
            <SynergyCard key={s.id} synergy={s} />
          ))}
        </div>
      )}
    </div>
  );
}
