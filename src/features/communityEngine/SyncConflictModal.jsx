'use client';

import React, { useState } from 'react';
import { GitMerge, Loader2, Check, Undo2, CalendarRange, UtensilsCrossed } from 'lucide-react';
import { saveSchedule, savePersonalMenu } from '@/features/profileEngine/profileApi';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

/** Compact preview of a class timetable. */
function SchedulePreview({ slots = [] }) {
  const grouped = DAYS.map((d) => ({ day: d, items: slots.filter((s) => s.day === d) })).filter(
    (g) => g.items.length
  );
  if (!grouped.length) return <p className="text-xs text-gray-400">No class slots.</p>;
  return (
    <div className="space-y-2">
      {grouped.map((g) => (
        <div key={g.day}>
          <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">{g.day.slice(0, 3)}</p>
          <ul className="mt-0.5 space-y-0.5">
            {g.items.map((s, i) => (
              <li key={i} className="flex items-center justify-between text-xs">
                <span className="font-medium text-gray-800">{s.subject}</span>
                <span className="text-gray-500">
                  {s.timeStart || '—'}
                  {s.timeEnd ? `–${s.timeEnd}` : ''} {s.room ? `· ${s.room}` : ''}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/** Compact preview of a mess menu. */
function MenuPreview({ menu = {} }) {
  const rows = DAYS.filter((d) => menu[d]).map((d) => ({ day: d, meals: menu[d] }));
  if (!rows.length) return <p className="text-xs text-gray-400">No menu set.</p>;
  return (
    <div className="space-y-1.5">
      {rows.map(({ day, meals }) => (
        <div key={day} className="text-xs">
          <span className="font-bold uppercase tracking-wide text-gray-400">{day.slice(0, 3)}: </span>
          <span className="text-gray-700">
            {['breakfast', 'lunch', 'snacks', 'dinner']
              .map((m) => meals[m])
              .filter(Boolean)
              .join(' · ') || '—'}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * Adoption showcase shown after joining a Class or Mess community. The backend
 * has ALREADY overridden the member's personal timetable / menu with the
 * community's baseline; this modal showcases what was applied and offers an
 * undo back to the member's previous version (Keep Own).
 */
export default function SyncConflictModal({ adopted, onResolved }) {
  const [busy, setBusy] = useState(false);
  const isClass = adopted.kind === 'class';
  const Icon = isClass ? CalendarRange : UtensilsCrossed;
  const label = isClass ? 'timetable' : 'mess menu';
  const adoptedData = isClass ? adopted.communitySchedule : adopted.communityMenu;
  const previousData = isClass ? adopted.previousSchedule : adopted.previousMenu;
  const hadPrevious = Array.isArray(previousData)
    ? previousData.length > 0
    : previousData && Object.keys(previousData).length > 0;

  const handleKeep = () => onResolved?.('synced');

  const handleUndo = async () => {
    setBusy(true);
    if (isClass) {
      await saveSchedule(previousData || []);
    } else {
      await savePersonalMenu(previousData || {});
    }
    setBusy(false);
    onResolved?.('reverted');
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" aria-hidden />
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start gap-3 border-b border-gray-100 px-6 py-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
            <GitMerge className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Your {label} now matches the community</h2>
            <p className="mt-0.5 text-sm text-gray-500">
              You joined <span className="font-semibold text-gray-700">{adopted.nodeName}</span>. Its{' '}
              {label} has been applied to your profile
              {hadPrevious ? ', replacing your previous version.' : '.'}
            </p>
          </div>
        </div>

        <div className="max-h-[50vh] overflow-y-auto px-6 py-5">
          <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-4">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-indigo-700">
              <Icon className="h-3.5 w-3.5" /> Adopted {label} · {adopted.nodeName}
            </p>
            {isClass ? <SchedulePreview slots={adoptedData} /> : <MenuPreview menu={adoptedData} />}
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-gray-100 px-6 py-4 sm:flex-row sm:justify-end">
          {hadPrevious && (
            <button
              onClick={handleUndo}
              disabled={busy}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Undo2 className="h-4 w-4" />}
              Keep my previous {label}
            </button>
          )}
          <button
            onClick={handleKeep}
            disabled={busy}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
          >
            <Check className="h-4 w-4" />
            Keep the community {label}
          </button>
        </div>
      </div>
    </div>
  );
}
