'use client';

import React, { useState } from 'react';
import { HeartHandshake, ShieldAlert, BookX } from 'lucide-react';

export default function EmpathyWidget() {
  const [nudgeSent, setNudgeSent] = useState(false);

  // Mock Data: B.Tech CSE Student Context
  const empathyState = {
    sleepDeficit: "4.5 hours",
    burnoutRisk: "High",
    safeSkip: {
      course: "CSE-B Technical Elective",
      currentAttendance: "82%",
      postSkipAttendance: "78%", // Above the 75% college mandate
    }
  };

  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 shadow-sm mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold uppercase tracking-wide text-rose-800 flex items-center gap-2">
          <HeartHandshake className="h-4 w-4" />
          Empathy Mesh
        </h3>
        <span className="rounded-full bg-rose-200 px-2.5 py-0.5 text-xs font-semibold text-rose-900">
          Intervention Required
        </span>
      </div>

      <div className="space-y-5">
        <div className="flex items-start gap-3 rounded-lg bg-white p-4 shadow-sm border border-rose-100">
          <ShieldAlert className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-gray-900">Burnout Pattern Detected</p>
            <p className="text-xs text-gray-600 mt-1">
              Biometrics indicate a {empathyState.sleepDeficit} average sleep cycle this week. 
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm border border-rose-100">
          <div className="flex items-center gap-2 mb-2">
            <BookX className="h-4 w-4 text-indigo-500" />
            <p className="text-sm font-bold text-gray-900">Safe-Skip Calculus Result</p>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            You can safely skip today's <span className="font-semibold text-gray-900">{empathyState.safeSkip.course}</span> to rest. Your attendance will drop from {empathyState.safeSkip.currentAttendance} to {empathyState.safeSkip.postSkipAttendance}, remaining above the mandate.
          </p>
          <button 
            disabled={nudgeSent}
            onClick={() => setNudgeSent(true)}
            className="w-full rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-700 disabled:opacity-50 transition-all"
          >
            {nudgeSent ? 'Proxy Note Sent to CR' : 'Execute Safe-Skip & Notify CR'}
          </button>
        </div>
      </div>
    </div>
  );
}