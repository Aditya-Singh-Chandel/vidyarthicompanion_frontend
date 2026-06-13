'use client';

import React, { useState } from 'react';
import { Zap, Pizza, Users } from 'lucide-react';

export default function SynergyWidget() {
  const [isSplit, setIsSplit] = useState(false);

  return (
    <div className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 shadow-sm mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold uppercase tracking-wide text-indigo-800 flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Synergy Scanner
        </h3>
      </div>

      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 shadow-sm">
          <Pizza className="h-5 w-5" />
        </div>
        
        <div className="flex-1">
          <p className="text-sm font-bold text-gray-900">Community Meal Overlap</p>
          <p className="mt-1 text-xs leading-relaxed text-gray-600">
            Mess food quality flagged by 40 batchmates. You and Rohan (from your Fooding Graph) both have exactly $10 remaining in Amazon Pay.
          </p>
          
          <button
            disabled={isSplit}
            onClick={() => setIsSplit(true)}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 transition-all"
          >
            <Users className="h-4 w-4" />
            {isSplit ? 'Request Sent to Rohan' : 'Tap to auto-split $15 pizza order'}
          </button>
        </div>
      </div>
    </div>
  );
}