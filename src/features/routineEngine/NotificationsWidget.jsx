'use client';

import React, { useState, useEffect } from 'react';
import { BellRing, AlertTriangle, Navigation, MapPin, Footprints, Bike, Bus, Loader2 } from 'lucide-react';
import { getDailyPlan } from './routineApi';
import { getDepartureTime } from '../transitEngine/transitApi';

const MODE_ICON = { Walking: Footprints, Cycling: Bike, 'Auto Rickshaw': Bus };

/** Human label for "time until", from hours. */
function untilLabel(hours) {
  if (hours == null) return '';
  if (hours < 1) return `${Math.max(1, Math.round(hours * 60))} min`;
  if (hours < 24) return `${Math.round(hours)} hr`;
  return `${Math.round(hours / 24)} day${Math.round(hours / 24) > 1 ? 's' : ''}`;
}

export default function NotificationsWidget() {
  const [loading, setLoading] = useState(true);
  const [deadline, setDeadline] = useState(null);
  const [departure, setDeparture] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const plan = await getDailyPlan();
      if (!cancelled) {
        setDeadline(plan?.nextDeadline ?? null);
        setLoading(false);
      }
    })();

    // Departure needs location (start) -> event location (end).
    const fetchDeparture = async (loc) => {
      const data = await getDepartureTime('next', loc);
      if (!cancelled && data?.success) setDeparture(data.data);
    };
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchDeparture(`${pos.coords.latitude},${pos.coords.longitude}`),
        () => fetchDeparture('campus'),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 60000 }
      );
    } else {
      fetchDeparture('campus');
    }

    return () => {
      cancelled = true;
    };
  }, []);

  const urgentDeadline = deadline && deadline.hoursUntil != null && deadline.hoursUntil <= 6;

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <BellRing className="h-5 w-5 text-indigo-600" />
        <h3 className="text-sm font-bold uppercase tracking-wide text-indigo-800">
          Notifications
        </h3>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-4 text-sm text-gray-400">
          <Loader2 className="h-4 w-4 animate-spin" /> Checking your day…
        </div>
      ) : (
        <div className="space-y-4">
          {/* Deadline alert */}
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Deadline Alert
            </p>
            {deadline ? (
              <div
                className={`flex items-start gap-2 rounded-lg border p-3 text-sm ${
                  urgentDeadline
                    ? 'border-red-200 bg-red-50 text-red-800'
                    : 'border-amber-200 bg-amber-50 text-amber-800'
                }`}
              >
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  <span className="font-bold">{urgentDeadline ? 'Urgent: ' : ''}{deadline.title}</span>{' '}
                  due in {untilLabel(deadline.hoursUntil)}
                  {deadline.location ? ` · ${deadline.location}` : ''}.
                </span>
              </div>
            ) : (
              <p className="text-xs text-gray-400">No upcoming deadlines. You&apos;re clear.</p>
            )}
          </div>

          {/* Departure alert (only when same-day travel is actually required) */}
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
              Departure Alert (Next Task)
            </p>
            {departure && ['safe', 'warning', 'critical'].includes(departure.status) ? (
              <div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                  <Navigation className="h-4 w-4 text-orange-600" />
                  {departure.title}
                  <span className="ml-auto text-xs font-semibold text-orange-700">
                    Departs in {departure.leaveIn}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="h-3 w-3" /> {departure.location} · {departure.time}
                </div>
                {Array.isArray(departure.modes) && departure.modes.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {departure.modes.map((m) => {
                      const Icon = MODE_ICON[m.mode] || Navigation;
                      return (
                        <span
                          key={m.mode}
                          className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-1 text-xs font-medium text-gray-700 ring-1 ring-inset ring-orange-100"
                        >
                          <Icon className="h-3 w-3 text-orange-500" />
                          {m.mode}: {m.travelMinutes} min
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : departure ? (
              <p className="text-xs text-gray-400">
                {departure.message || 'No travel needed for your next task.'}
              </p>
            ) : (
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Loader2 className="h-3 w-3 animate-spin" /> Calculating route from your location…
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
