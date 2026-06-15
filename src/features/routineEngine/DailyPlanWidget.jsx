'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  FileClock,
  FlaskConical,
  BookOpen,
  Users,
  HeartPulse,
  HeartHandshake,
  Wallet,
  Sparkles,
  Loader2,
  CheckCircle2,
  Clock3,
  MapPin,
  CalendarCheck,
  CalendarClock,
  Check,
  X,
  ArrowRight,
} from 'lucide-react';
import { getDailyPlan } from './routineApi';
import { respondMeetup } from '@/features/communityEngine/communityApi';

// Visual treatment per card type.
const TYPE_STYLES = {
  exam: { Icon: AlertTriangle, ring: 'border-l-red-500', chip: 'bg-red-100 text-red-700', label: 'Exam' },
  deadline: { Icon: FileClock, ring: 'border-l-orange-500', chip: 'bg-orange-100 text-orange-700', label: 'Deadline' },
  lab: { Icon: FlaskConical, ring: 'border-l-blue-500', chip: 'bg-blue-100 text-blue-700', label: 'Lab' },
  class: { Icon: BookOpen, ring: 'border-l-indigo-500', chip: 'bg-indigo-100 text-indigo-700', label: 'Class' },
  event: { Icon: Users, ring: 'border-l-purple-500', chip: 'bg-purple-100 text-purple-700', label: 'Event' },
  wellbeing: { Icon: HeartPulse, ring: 'border-l-rose-500', chip: 'bg-rose-100 text-rose-700', label: 'Wellbeing' },
  empathy_alert: { Icon: HeartHandshake, ring: 'border-l-pink-500', chip: 'bg-pink-100 text-pink-700', label: 'Empathy Mesh' },
  meetup_invite: { Icon: CalendarClock, ring: 'border-l-emerald-500', chip: 'bg-emerald-100 text-emerald-700', label: 'Meet Up' },
  budget: { Icon: Wallet, ring: 'border-l-amber-500', chip: 'bg-amber-100 text-amber-700', label: 'Budget' },
};

const STATUS_BADGE = {
  verified: { cls: 'text-emerald-700 bg-emerald-100', Icon: CheckCircle2, label: 'Verified' },
  pending: { cls: 'text-amber-700 bg-amber-100', Icon: Clock3, label: 'Pending' },
};

/** Friendly relative-day label for a card's date. */
function relativeDay(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(d);
  target.setHours(0, 0, 0, 0);
  const diff = Math.round((target - today) / (24 * 60 * 60 * 1000));
  const time = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  if (diff === 0) return `Today · ${time}`;
  if (diff === 1) return `Tomorrow · ${time}`;
  if (diff > 1) return `In ${diff} days · ${time}`;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function PlanCard({ card, onRespond, busy }) {
  const style = TYPE_STYLES[card.type] || TYPE_STYLES.class;
  const Icon = style.Icon;
  const when = relativeDay(card.date);
  const statusBadge = card.kind === 'event' ? STATUS_BADGE[card.status] : null;

  // Reach-out card -> deep link into the member's Meet Up scheduler.
  const showSchedule = card.type === 'empathy_alert' && card.action === 'meet_up' && card.nodeId && card.memberId;
  // Incoming invite -> accept / decline inline, or change time in the community.
  const isInvite = card.type === 'meetup_invite' && card.meetupId;

  return (
    <li className={`rounded-lg border border-gray-100 border-l-4 ${style.ring} bg-white p-4 shadow-sm`}>
      <div className="flex items-start gap-3">
        <span className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${style.chip}`}>
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-bold text-gray-900">{card.title}</p>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${style.chip}`}>
              {style.label}
            </span>
          </div>

          {(when || card.location) && (
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
              {when && <span className="flex items-center gap-1"><Clock3 className="h-3 w-3" />{when}</span>}
              {card.location && (
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{card.location}</span>
              )}
            </div>
          )}

          {card.note && <p className="mt-1.5 text-xs text-gray-600">{card.note}</p>}

          {statusBadge && (
            <span className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusBadge.cls}`}>
              <statusBadge.Icon className="h-3 w-3" />
              {statusBadge.label}
            </span>
          )}

          {showSchedule && (
            <Link
              href={`/community?node=${encodeURIComponent(card.nodeId)}&member=${encodeURIComponent(card.memberId)}&meetup=1`}
              className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-pink-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-pink-700"
            >
              <CalendarCheck className="h-3.5 w-3.5" /> Schedule Meet Up
            </Link>
          )}

          {isInvite && (
            <div className="mt-2.5 flex flex-wrap gap-2">
              <button
                onClick={() => onRespond(card.meetupId, 'accept')}
                disabled={busy}
                className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />} Accept
              </button>
              <button
                onClick={() => onRespond(card.meetupId, 'reject')}
                disabled={busy}
                className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-50"
              >
                <X className="h-3.5 w-3.5" /> Decline
              </button>
              <Link
                href={`/community?node=${encodeURIComponent(card.nodeId)}&member=${encodeURIComponent(card.otherUserId)}&meetup=1`}
                className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
              >
                Change time <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

export default function DailyPlanWidget() {
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState(null);
  const [now, setNow] = useState(null);
  const [actingId, setActingId] = useState(null);

  const load = useCallback(async () => {
    const data = await getDailyPlan();
    setPlan(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await getDailyPlan();
      if (cancelled) return;
      setPlan(data);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Near-instant updates: re-poll the plan so a Meet Up scheduled/answered
  // elsewhere shows up here without a manual refresh.
  useEffect(() => {
    const id = setInterval(() => {
      getDailyPlan().then((data) => {
        if (data) setPlan(data);
      });
    }, 15000);
    return () => clearInterval(id);
  }, []);

  const handleRespond = useCallback(
    async (meetupId, action) => {
      setActingId(meetupId);
      await respondMeetup(meetupId, action);
      await load();
      setActingId(null);
    },
    [load]
  );

  // Live clock (set via timers so it never runs setState synchronously in the effect).
  useEffect(() => {
    const prime = setTimeout(() => setNow(new Date()), 0);
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => {
      clearTimeout(prime);
      clearInterval(id);
    };
  }, []);

  const clockLabel = now
    ? now.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', second: '2-digit' })
    : '--:--';

  // Safety guard: only show future event cards (non-event cards always shown).
  // Uses the live clock state (pure) rather than Date.now() during render.
  const visibleCards = (plan?.cards || []).filter((c) => {
    if (c.kind !== 'event' || !c.date) return true;
    if (!now) return true; // before the clock primes, trust the backend's future-only filter
    return new Date(c.date).getTime() >= now.getTime() - 60000;
  });

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-1 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-black tracking-tight text-gray-900">Today&apos;s Plan</h2>
        </div>
        <span
          className="rounded-lg bg-gray-900 px-3 py-1 font-mono text-sm font-bold tabular-nums tracking-wider text-emerald-300 shadow-inner"
          aria-label="current time"
        >
          {clockLabel}
        </span>
      </div>
      <p className="mb-4 text-xs text-gray-500">
        Auto-prioritized from your upcoming schedule, wellbeing, and budget. Tests always rank first.
      </p>

      {loading ? (
        <div className="flex items-center gap-2 py-8 text-sm text-gray-400">
          <Loader2 className="h-4 w-4 animate-spin" /> Assembling your day…
        </div>
      ) : !plan || visibleCards.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-200 py-10 text-center text-sm text-gray-400">
          Nothing upcoming. Upload a timetable via the Override Engine to get started.
        </div>
      ) : (
        <>
          {plan.summary && (
            <div className="mb-4 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-gray-100 px-2.5 py-1 font-medium text-gray-700">
                {plan.summary.itemsInHorizon} upcoming
              </span>
              <span className="rounded-full bg-rose-50 px-2.5 py-1 font-medium text-rose-700">
                Burnout {plan.summary.burnoutScore}/10
              </span>
              {plan.summary.balance != null && (
                <span
                  className={`rounded-full px-2.5 py-1 font-medium ${
                    plan.summary.isBudgetCritical ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
                  }`}
                >
                  ₹{Math.round(plan.summary.balance)} left
                </span>
              )}
            </div>
          )}

          <ul className="space-y-3">
            {visibleCards.map((card) => (
              <PlanCard
                key={card.id}
                card={card}
                onRespond={handleRespond}
                busy={actingId === card.meetupId}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
