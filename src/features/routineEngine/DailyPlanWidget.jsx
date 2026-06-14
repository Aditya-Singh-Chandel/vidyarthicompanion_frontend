'use client';

import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  FileClock,
  FlaskConical,
  BookOpen,
  Users,
  HeartPulse,
  Wallet,
  Sparkles,
  Loader2,
  CheckCircle2,
  Clock3,
  MapPin,
} from 'lucide-react';
import { getDailyPlan } from './routineApi';

// Visual treatment per card type.
const TYPE_STYLES = {
  exam: { Icon: AlertTriangle, ring: 'border-l-red-500', chip: 'bg-red-100 text-red-700', label: 'Exam' },
  deadline: { Icon: FileClock, ring: 'border-l-orange-500', chip: 'bg-orange-100 text-orange-700', label: 'Deadline' },
  lab: { Icon: FlaskConical, ring: 'border-l-blue-500', chip: 'bg-blue-100 text-blue-700', label: 'Lab' },
  class: { Icon: BookOpen, ring: 'border-l-indigo-500', chip: 'bg-indigo-100 text-indigo-700', label: 'Class' },
  event: { Icon: Users, ring: 'border-l-purple-500', chip: 'bg-purple-100 text-purple-700', label: 'Event' },
  wellbeing: { Icon: HeartPulse, ring: 'border-l-rose-500', chip: 'bg-rose-100 text-rose-700', label: 'Wellbeing' },
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

function PlanCard({ card }) {
  const style = TYPE_STYLES[card.type] || TYPE_STYLES.class;
  const Icon = style.Icon;
  const when = relativeDay(card.date);
  const statusBadge = card.kind === 'event' ? STATUS_BADGE[card.status] : null;

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
              {typeof card.consensusScore === 'number' ? ` · consensus ${card.consensusScore}` : ''}
            </span>
          )}
        </div>
      </div>
    </li>
  );
}

export default function DailyPlanWidget() {
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState(null);

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

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-1 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-indigo-600" />
        <h2 className="text-lg font-black tracking-tight text-gray-900">Today&apos;s Plan</h2>
      </div>
      <p className="mb-4 text-xs text-gray-500">
        Auto-prioritized from your verified schedule, wellbeing, and budget. Tests always rank first.
      </p>

      {loading ? (
        <div className="flex items-center gap-2 py-8 text-sm text-gray-400">
          <Loader2 className="h-4 w-4 animate-spin" /> Assembling your day…
        </div>
      ) : !plan || plan.cards.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-200 py-10 text-center text-sm text-gray-400">
          Nothing scheduled in the next week. Upload a timetable via the Override Engine to get started.
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
            {plan.cards.map((card) => (
              <PlanCard key={card.id} card={card} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
