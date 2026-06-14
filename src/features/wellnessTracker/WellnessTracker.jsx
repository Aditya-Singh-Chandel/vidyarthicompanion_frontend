'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Activity,
  BedDouble,
  CalendarCheck,
  CalendarX,
  GraduationCap,
  Info,
  Loader2,
  UtensilsCrossed,
} from 'lucide-react';
import WellnessGauge from './WellnessGauge';
import { getWellnessSummary, logSleepCycle } from './wellnessApi';

const SLEEP_OPTIONS = ['4-6 hrs', '6-8 hrs', '8-10 hrs', '10-12 hrs'];

const LEVEL_STYLES = {
  low: { text: 'text-emerald-600', chip: 'bg-emerald-100 text-emerald-700', label: 'LOW' },
  moderate: { text: 'text-amber-600', chip: 'bg-amber-100 text-amber-700', label: 'MODERATE' },
  high: { text: 'text-rose-600', chip: 'bg-rose-100 text-rose-700', label: 'HIGH' },
};

/** Blue sleep-history mini bar chart (representative hours, max 12h). */
function SleepBars({ series = [] }) {
  if (!series.length) {
    return <span className="text-[11px] text-gray-400">No sleep logged</span>;
  }
  return (
    <div className="flex h-8 items-end gap-1" aria-hidden="true">
      {series.map((hours, idx) => (
        <div
          key={idx}
          className="w-1.5 rounded-sm bg-blue-500/80"
          style={{ height: `${Math.max(8, (Math.min(hours, 12) / 12) * 100)}%` }}
          title={`${hours}h`}
        />
      ))}
    </div>
  );
}

/** Green 10-day attendance mini bar chart (bar height = that day's %). */
function AttendanceBars({ series = [] }) {
  if (!series.length) {
    return <span className="text-[11px] text-gray-400">No attendance data</span>;
  }
  return (
    <div className="flex h-8 items-end gap-1" aria-hidden="true">
      {series.map((d, idx) => (
        <div
          key={idx}
          className="w-1.5 rounded-sm bg-emerald-500/80"
          style={{ height: `${Math.max(6, d.pct)}%` }}
          title={`${d.label}: ${d.pct}%`}
        />
      ))}
    </div>
  );
}

/** Red/grey dots for recent routine consistency (red = missed). */
function ScheduleDots({ dots = [] }) {
  if (!dots.length) {
    return <span className="text-[11px] text-gray-400">No routines tracked</span>;
  }
  return (
    <div className="flex items-center gap-1.5" aria-hidden="true">
      {dots.map((attended, idx) => (
        <span
          key={idx}
          className={`h-3.5 w-3.5 rounded-sm ${attended ? 'bg-gray-300' : 'bg-rose-500'}`}
        />
      ))}
    </div>
  );
}

/** One factor row: icon + label/value on the left, visual on the right. */
function FactorRow({ Icon, iconClass, title, value, children }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-start gap-2.5">
        <span className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${iconClass}`}>
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-bold text-gray-900">{title}</p>
          {value && <p className="text-xs text-gray-500">{value}</p>}
        </div>
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </div>
  );
}

export default function WellnessTracker() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [sleepChoice, setSleepChoice] = useState('6-8 hrs');
  const [savingSleep, setSavingSleep] = useState(false);

  const load = useCallback(async () => {
    const data = await getWellnessSummary();
    setSummary(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, [load]);

  const handleLogSleep = async () => {
    setSavingSleep(true);
    const result = await logSleepCycle(sleepChoice);
    setSavingSleep(false);
    if (result) load();
  };

  // --- Loading state ---
  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Wellness Tracker
        </div>
        <p className="mt-3 text-xs text-gray-500">Computing your wellness signals…</p>
      </div>
    );
  }

  // --- Error / no-data fallback ---
  if (!summary) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-700">
          <Activity className="h-4 w-4" />
          Wellness Tracker &amp; Burnout Score
        </h3>
        <p className="mt-3 text-xs text-gray-500">
          Wellness data is temporarily unavailable. Please try again shortly.
        </p>
      </div>
    );
  }

  const { tiredness, isolation, overall, moodPromptDue, insufficientData } = summary;
  const level = LEVEL_STYLES[overall.level] || LEVEL_STYLES.low;
  const sleep = tiredness.sleep || {};
  const attendance = tiredness.attendance || {};
  const meals = isolation.meals || {};
  const schedule = isolation.schedule || {};

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-gray-800">
        <Activity className="h-4 w-4 text-indigo-600" />
        Wellness Tracker &amp; Burnout Score
      </h3>
      <p className="mt-1 text-xs text-gray-500">
        Visualized tracked data, automated by the Empathy Engine without user input.
      </p>

      {insufficientData && (
        <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600">
          Not enough activity logged yet. Scores will sharpen as your attendance, meals and
          sleep data come in — log last night&apos;s sleep below to get started.
        </div>
      )}

      {/* Tiredness + Isolation cards */}
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Tiredness */}
        <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
          <WellnessGauge value={tiredness.score} label="Tiredness Score" size={180} />

          <div className="mt-4 space-y-3">
            <FactorRow
              Icon={BedDouble}
              iconClass="bg-blue-100 text-blue-600"
              title="Sleep Cycle"
              value={sleep.avgHours != null ? `${sleep.avgHours}h avg` : 'Not logged yet'}
            >
              <SleepBars series={sleep.series} />
            </FactorRow>

            <FactorRow
              Icon={CalendarCheck}
              iconClass="bg-emerald-100 text-emerald-600"
              title="Attendance"
              value={`${attendance.pct ?? 0}%`}
            >
              <AttendanceBars series={attendance.series} />
            </FactorRow>

            <FactorRow
              Icon={GraduationCap}
              iconClass="bg-indigo-100 text-indigo-600"
              title="Time Spent in Study/Classes"
              value={`${tiredness.study?.hoursToday ?? 0}h today`}
            />
          </div>
        </div>

        {/* Isolation */}
        <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
          <WellnessGauge value={isolation.score} label="Isolation Score" size={180} />

          <div className="mt-4 space-y-3">
            <FactorRow
              Icon={UtensilsCrossed}
              iconClass="bg-amber-100 text-amber-600"
              title="Missing Meals"
              value={meals.status || '—'}
            />

            <FactorRow
              Icon={CalendarX}
              iconClass="bg-rose-100 text-rose-600"
              title="Regular Schedule Consistency"
              value="Missed routines tracker"
            />

            <div className="flex items-center justify-between gap-3 pl-10">
              <ScheduleDots dots={schedule.dots} />
              <span className="text-[11px] text-gray-500">
                {schedule.missedCount > 0
                  ? `showing ${schedule.missedCount} miss${schedule.missedCount > 1 ? 'es' : ''}`
                  : 'on track'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Overall burnout */}
      <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50/60 p-4">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col items-center sm:items-start">
            <WellnessGauge value={overall.score} size={200} showValue={false} />
            <p className="mt-1 text-center text-sm font-black text-gray-900 sm:text-left">
              Overall Burnout Score:{' '}
              <span className={level.text}>{level.label}</span>
            </p>
            <p className="text-[11px] text-gray-500">
              Calculated from the automated tiredness and isolation factors.
            </p>
          </div>

          {moodPromptDue && (
            <div className="max-w-xs rounded-lg border border-sky-200 bg-sky-50 p-3 text-xs text-sky-800">
              <p className="flex items-center gap-1.5 font-semibold">
                <Info className="h-3.5 w-3.5" />
                Quick check-in
              </p>
              <p className="mt-1">
                Your wellness factors have stayed low for a couple of days — a short mood
                questionnaire will be prompted to see how you&apos;re really doing.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Sleep logger (the one manual signal) */}
      <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4">
        <label
          htmlFor="sleep-cycle"
          className="flex items-center gap-1.5 text-xs font-bold text-gray-700"
        >
          <BedDouble className="h-4 w-4 text-blue-500" />
          Log last night&apos;s sleep
          {sleep.hasToday && (
            <span className="ml-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
              Logged today
            </span>
          )}
        </label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
          <select
            id="sleep-cycle"
            value={sleepChoice}
            onChange={(e) => setSleepChoice(e.target.value)}
            className="flex-1 rounded-md border border-gray-300 px-2 py-1.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none"
          >
            {SLEEP_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleLogSleep}
            disabled={savingSleep}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
          >
            {savingSleep ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
