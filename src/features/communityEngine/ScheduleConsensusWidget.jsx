'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  CalendarClock,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  Clock3,
  XCircle,
  Loader2,
} from 'lucide-react';
import { getScheduleEvents, voteOnEvent } from './communityApi';

const STATUS_STYLES = {
  verified: { label: 'Verified', cls: 'bg-emerald-100 text-emerald-800', Icon: CheckCircle2 },
  pending: { label: 'Pending', cls: 'bg-amber-100 text-amber-800', Icon: Clock3 },
  rejected: { label: 'Rejected', cls: 'bg-rose-100 text-rose-800', Icon: XCircle },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.pending;
  const Icon = s.Icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${s.cls}`}>
      <Icon className="h-3 w-3" />
      {s.label}
    </span>
  );
}

function formatWhen(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function ScheduleConsensusWidget() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    const data = await getScheduleEvents();
    setEvents(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, [load]);

  const handleVote = async (eventId, voteType) => {
    setBusyId(eventId);
    const result = await voteOnEvent(eventId, voteType);
    if (result) {
      setEvents((prev) =>
        prev.map((e) =>
          e.id === eventId
            ? { ...e, consensusScore: result.consensusScore, status: result.status, myVote: voteType }
            : e
        )
      );
    }
    setBusyId(null);
  };

  return (
    <div className="rounded-xl border border-indigo-100 bg-white p-5 shadow-sm">
      <div className="mb-1 flex items-center gap-2">
        <CalendarClock className="h-5 w-5 text-indigo-600" />
        <h3 className="text-sm font-bold uppercase tracking-wide text-indigo-800">
          Schedule Consensus
        </h3>
      </div>
      <p className="mb-4 text-xs text-gray-500">
        Echo to verify a schedule entry or flag an error. A CR&apos;s vote carries more weight.
      </p>

      {loading ? (
        <div className="flex items-center gap-2 py-6 text-sm text-gray-400">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading schedule feed…
        </div>
      ) : events.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-200 py-8 text-center text-sm text-gray-400">
          No events yet. Upload a timetable via the Override Engine to start.
        </div>
      ) : (
        <ul className="space-y-3">
          {events.map((ev) => (
            <li
              key={ev.id}
              className="rounded-lg border border-gray-100 bg-gray-50 p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900">{ev.eventName}</p>
                  <p className="text-xs text-gray-500">
                    {formatWhen(ev.date)} · {ev.location}
                  </p>
                  <span className="mt-1 inline-block rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
                    {ev.nodeName || 'Personal'}
                  </span>
                </div>
                <StatusBadge status={ev.status} />
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Consensus: <span className="font-bold text-gray-800">{ev.consensusScore}</span>
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleVote(ev.id, 1)}
                    disabled={busyId === ev.id}
                    className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors disabled:opacity-50 ${
                      ev.myVote === 1
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    <ThumbsUp className="h-3 w-3" /> Echo
                  </button>
                  <button
                    onClick={() => handleVote(ev.id, -1)}
                    disabled={busyId === ev.id}
                    className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors disabled:opacity-50 ${
                      ev.myVote === -1
                        ? 'bg-rose-600 text-white'
                        : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                    }`}
                  >
                    <ThumbsDown className="h-3 w-3" /> Flag
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
