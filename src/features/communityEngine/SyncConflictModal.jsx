'use client';

import React, { useState } from 'react';
import { GitMerge, Loader2, ShieldCheck, CalendarRange, UtensilsCrossed } from 'lucide-react';
import { saveSchedule, savePersonalMenu } from '@/features/profileEngine/profileApi';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

/** Compact preview of the community's class timetable. */
function SchedulePreview({ slots = [] }) {
  const grouped = DAYS.map((d) => ({
    day: d,
    items: slots.filter((s) => s.day === d),
  })).filter((g) => g.items.length);

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

/** Compact preview of the community's mess menu. */
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
 * Sync conflict resolution shown after joining a Class or Mess community whose
 * baseline timetable / menu differs from the user's own profile data.
 *  - Sync     : overwrite the user's personal timetable / menu with the group's.
 *  - Keep Own : join, but retain personal data unchanged.
 */
export default function SyncConflictModal({ conflict, onResolved }) {
  const [busy, setBusy] = useState(false);
  const isClass = conflict.kind === 'class';
  const Icon = isClass ? CalendarRange : UtensilsCrossed;
  const label = isClass ? 'timetable' : 'mess menu';

  const handleSync = async () => {
    setBusy(true);
    if (isClass) {
      await saveSchedule(conflict.communitySchedule || []);
    } else {
      await savePersonalMenu(conflict.communityMenu || {});
    }
    setBusy(false);
    onResolved?.('synced');
  };

  const handleKeep = () => onResolved?.('kept');

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" aria-hidden />
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start gap-3 border-b border-gray-100 px-6 py-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <GitMerge className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Sync your {label}?</h2>
            <p className="mt-0.5 text-sm text-gray-500">
              You joined <span className="font-semibold text-gray-700">{conflict.nodeName}</span>, but its{' '}
              {label} differs from yours.
            </p>
          </div>
        </div>

        <div className="max-h-[50vh] overflow-y-auto px-6 py-5">
          <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-4">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-gray-500">
              <Icon className="h-3.5 w-3.5" /> Community {label}
            </p>
            {isClass ? (
              <SchedulePreview slots={conflict.communitySchedule} />
            ) : (
              <MenuPreview menu={conflict.communityMenu} />
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-gray-100 px-6 py-4 sm:flex-row sm:justify-end">
          <button
            onClick={handleKeep}
            disabled={busy}
            className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            Keep my own {label}
          </button>
          <button
            onClick={handleSync}
            disabled={busy}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
            Sync to community {label}
          </button>
        </div>
      </div>
    </div>
  );
}
