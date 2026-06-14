'use client';

import React, { useState, useEffect } from 'react';
import { HeartHandshake, ShieldAlert, BookX, HeartPulse, Loader2 } from 'lucide-react';
import useRoutineStore from '@/routineState/useRoutineStore';
import { evaluateSafeSkip } from './empathyApi';

const USER_ID = 'student_1';

export default function EmpathyWidget() {
  const triggerSafeSkip = useRoutineStore((state) => state.triggerSafeSkip);

  const [loading, setLoading] = useState(true);
  const [evaluation, setEvaluation] = useState(null);
  const [nudgeSent, setNudgeSent] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const data = await evaluateSafeSkip(USER_ID);
      if (cancelled) return;
      setEvaluation(data);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSafeSkip = () => {
    setNudgeSent(true);
    triggerSafeSkip(evaluation?.reason || 'Safe-Skip executed via Empathy Mesh.');
  };

  // --- Loading state ---
  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm mt-8">
        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Empathy Mesh
        </div>
        <p className="mt-3 text-xs text-gray-500">Evaluating wellness signals...</p>
      </div>
    );
  }

  const recommendSkip = evaluation?.recommendSkip === true;
  const burnoutScore = evaluation?.burnoutScore ?? 0;
  const reason =
    evaluation?.reason ??
    'Unable to reach the Empathy Mesh. Wellness evaluation is temporarily unavailable.';

  // --- Healthy / no-intervention state ---
  if (!recommendSkip) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wide text-emerald-800 flex items-center gap-2">
            <HeartHandshake className="h-4 w-4" />
            Empathy Mesh
          </h3>
          <span className="rounded-full bg-emerald-200 px-2.5 py-0.5 text-xs font-semibold text-emerald-900">
            Stable
          </span>
        </div>

        <div className="flex items-start gap-3 rounded-lg bg-white p-4 shadow-sm border border-emerald-100">
          <HeartPulse className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-gray-900">
              Burnout Score: {burnoutScore}/10
            </p>
            <p className="text-xs text-gray-600 mt-1">{reason}</p>
          </div>
        </div>
      </div>
    );
  }

  // --- Intervention required state ---
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
            <p className="text-sm font-bold text-gray-900">
              Burnout Pattern Detected ({burnoutScore}/10)
            </p>
            <p className="text-xs text-gray-600 mt-1">{reason}</p>
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm border border-rose-100">
          <div className="flex items-center gap-2 mb-2">
            <BookX className="h-4 w-4 text-indigo-500" />
            <p className="text-sm font-bold text-gray-900">Safe-Skip Calculus Result</p>
          </div>
          <p className="text-xs text-gray-600 mb-3">
            Based on your recent lifestyle logs, you can safely skip today&apos;s lowest-priority
            class to rest and recover.
          </p>
          <button
            disabled={nudgeSent}
            onClick={handleSafeSkip}
            className="w-full rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-700 disabled:opacity-50 transition-all"
          >
            {nudgeSent ? 'Proxy Note Sent to CR' : 'Execute Safe-Skip & Notify CR'}
          </button>
        </div>
      </div>
    </div>
  );
}
