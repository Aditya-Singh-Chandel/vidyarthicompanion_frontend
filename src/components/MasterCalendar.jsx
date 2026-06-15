'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import DailyTimeline from './DailyTimeline';
import { getScheduleEvents } from '@/features/communityEngine/communityApi';
import { getProfile } from '@/features/profileEngine/profileApi';

/** Local YYYY-MM-DD key for a Date (avoids UTC off-by-one). */
function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`;
}

const WEEKDAY_INDEX = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

/** "HH:MM" (24h) -> "9:00 AM". Falls back gracefully on bad input. */
function formatTime(hhmm) {
  if (!hhmm || !/^\d{1,2}:\d{2}$/.test(hhmm)) return hhmm || 'Time TBD';
  const [h, m] = hhmm.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

/** Minutes since midnight for ordering a timeline (unknown times sort last). */
function minutesOf(hhmm) {
  if (!hhmm || !/^\d{1,2}:\d{2}$/.test(hhmm)) return 24 * 60;
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

/** Map a backend event into the DailyTimeline shape. */
function toTimelineItem(ev) {
  const d = new Date(ev.date);
  const time = Number.isNaN(d.getTime())
    ? 'Time TBD'
    : d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  const isMeetup = ev.kind === 'meetup';
  return {
    id: ev.id,
    title: ev.eventName,
    time,
    sortKey: Number.isNaN(d.getTime()) ? 24 * 60 : d.getHours() * 60 + d.getMinutes(),
    location: ev.location || 'TBD',
    type: isMeetup ? 'community' : 'academic',
    // A proposed Meet Up is not confirmed yet -> show a "Tentative" tag.
    tentative: ev.status === 'pending',
  };
}

export default function MasterCalendar() {
  const today = useMemo(() => new Date(), []);
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => dateKey(new Date()));
  const [loading, setLoading] = useState(true);
  const [eventsByDate, setEventsByDate] = useState({});
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [events, profile] = await Promise.all([getScheduleEvents('verified'), getProfile()]);
      if (cancelled) return;
      const grouped = {};
      for (const ev of events) {
        const d = new Date(ev.date);
        if (Number.isNaN(d.getTime())) continue;
        const key = dateKey(d);
        (grouped[key] = grouped[key] || []).push(toTimelineItem(ev));
      }
      setEventsByDate(grouped);
      setSchedule(profile?.schedule || []);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Expand the weekly baseline class schedule into concrete dates for the
  // currently displayed month. This is what makes the Profile timetable show
  // up on the Master Calendar.
  const recurringByDate = useMemo(() => {
    if (!schedule.length) return {};
    const byWeekday = {};
    for (const slot of schedule) {
      const wd = WEEKDAY_INDEX[slot.day];
      if (wd === undefined) continue;
      (byWeekday[wd] = byWeekday[wd] || []).push(slot);
    }

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const out = {};
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);
      const slots = byWeekday[d.getDay()];
      if (!slots || !slots.length) continue;
      const key = dateKey(d);
      out[key] = slots.map((s, idx) => ({
        id: `class-${key}-${idx}`,
        title: s.subject,
        time: formatTime(s.timeStart),
        sortKey: minutesOf(s.timeStart),
        location: s.room || 'TBD',
        type: 'academic',
        isBaseline: true,
      }));
    }
    return out;
  }, [schedule, currentDate]);

  // Merge verified events + Meet Ups with the recurring class schedule for any given day.
  const combinedFor = (key) => {
    const merged = [...(recurringByDate[key] || []), ...(eventsByDate[key] || [])];
    return merged.sort((a, b) => (a.sortKey ?? 0) - (b.sortKey ?? 0));
  };

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const startingDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  const days = [];
  for (let i = 0; i < startingDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const cellKey = (day) =>
    `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(
      day
    ).padStart(2, '0')}`;

  const handleDateClick = (day) => {
    if (!day) return;
    setSelectedDate(cellKey(day));
  };

  const selectedEvents = combinedFor(selectedDate);
  const todayKey = dateKey(today);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">
      {/* Left Pane: The Monthly Grid */}
      <div className="w-full md:w-1/2 lg:w-2/5 border-b md:border-b-0 md:border-r border-gray-100 p-6 bg-gray-50/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-indigo-600" />
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
              className="p-1.5 rounded-md hover:bg-gray-200 transition-colors text-gray-600"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
              className="p-1.5 rounded-md hover:bg-gray-200 transition-colors text-gray-600"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-gray-400 uppercase py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const formattedDate = day ? cellKey(day) : null;
            const hasEvents =
              formattedDate &&
              ((eventsByDate[formattedDate]?.length || 0) + (recurringByDate[formattedDate]?.length || 0)) > 0;
            const isSelected = formattedDate === selectedDate;
            const isToday = formattedDate === todayKey;

            return (
              <div key={index} className="aspect-square p-0.5">
                {day ? (
                  <button
                    onClick={() => handleDateClick(day)}
                    className={`relative flex h-full w-full flex-col items-center justify-center rounded-lg text-sm transition-all ${
                      isSelected
                        ? 'bg-indigo-600 font-bold text-white shadow-sm'
                        : isToday
                        ? 'bg-indigo-50 font-semibold text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {day}
                    {hasEvents && (
                      <span
                        className={`absolute bottom-1 h-1 w-1 rounded-full ${
                          isSelected ? 'bg-white' : 'bg-indigo-500'
                        }`}
                      />
                    )}
                  </button>
                ) : (
                  <div className="h-full w-full" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Pane: The Daily Detail */}
      <div className="flex-1 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500">
            {new Date(`${selectedDate}T00:00:00`).toLocaleDateString(undefined, {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </h3>
          {selectedEvents.length > 0 && (
            <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600">
              {selectedEvents.length} {selectedEvents.length === 1 ? 'item' : 'items'}
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-sm text-gray-400">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading your schedule…
          </div>
        ) : (
          <DailyTimeline schedule={selectedEvents} />
        )}
      </div>
    </div>
  );
}
