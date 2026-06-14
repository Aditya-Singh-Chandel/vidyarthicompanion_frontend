'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { HeartHandshake, ShieldAlert, BookX, HeartPulse, Loader2, PlusCircle } from 'lucide-react';
import useRoutineStore from '@/routineState/useRoutineStore';
import { evaluateSafeSkip, logLifestyleMetric } from './empathyApi';

const LOG_TYPES = [
  { value: 'sleep', label: 'Sleep deficit' },
  { value: 'stress_level', label: 'Stress' },
  { value: 'meal_skipped', label: 'Meals skipped' },
  { value: 'social_isolation', label: 'Isolation' },
];

/** Inline form to log a wellness metric, then trigger a re-evaluation. */
function WellnessLogger({ onLogged }) {
  const [logType, setLogType] = useState('sleep');
  const [severity, setSeverity] = useState(5);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const result = await logLifestyleMetric({ logType, severity: Number(severity) });
    setSaving(false);
    if (result) onLogged();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
    >
      <div className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700">
        <PlusCircle className="h-4 w-4 text-indigo-500" />
        Log today&apos;s wellness
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex-1 text-xs font-medium text-gray-500">
          Signal
          <select
            value={logType}
            onChange={(e) => setLogType(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none"
          >
            {LOG_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex-1 text-xs font-medium text-gray-500">
          Severity: <span className="font-bold text-gray-800">{severity}/10</span>
          <input
            type="range"
            min="1"
            max="10"
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="mt-2 w-full accent-indigo-600"
          />
        </label>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Log
        </button>
      </div>
    </form>
  );
}

export default function EmpathyWidget() {
  const triggerSafeSkip = useRoutineStore((state) => state.triggerSafeSkip);

  const [loading, setLoading] = useState(true);
  const [evaluation, setEvaluation] = useState(null);
  const [nudgeSent, setNudgeSent] = useState(false);

  const evaluate = useCallback(async () => {
    const data = await evaluateSafeSkip();
    setEvaluation(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    (async () => {
      await evaluate();
    })();
  }, [evaluate]);

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
            <p className="text-sm font-bold text-gray-900">Burnout Score: {burnoutScore}/10</p>
            <p className="text-xs text-gray-600 mt-1">{reason}</p>
          </div>
        </div>

        <WellnessLogger onLogged={evaluate} />
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

        <WellnessLogger onLogged={evaluate} />
      </div>
    </div>
  );
}
