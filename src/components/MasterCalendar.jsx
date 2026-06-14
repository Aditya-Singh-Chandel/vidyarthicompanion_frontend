'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import DailyTimeline from './DailyTimeline';
import { getScheduleEvents } from '@/features/communityEngine/communityApi';

/** Local YYYY-MM-DD key for a Date (avoids UTC off-by-one). */
function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`;
}

/** Map a backend event into the DailyTimeline shape. */
function toTimelineItem(ev) {
  const d = new Date(ev.date);
  const time = Number.isNaN(d.getTime())
    ? 'Time TBD'
    : d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  return {
    id: ev.id,
    title: ev.eventName,
    time,
    location: ev.location || 'TBD',
    type: 'academic',
    isFlagged: ev.status === 'pending',
  };
}

export default function MasterCalendar() {
  const today = useMemo(() => new Date(), []);
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => dateKey(new Date()));
  const [loading, setLoading] = useState(true);
  const [eventsByDate, setEventsByDate] = useState({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const events = await getScheduleEvents();
      if (cancelled) return;
      const grouped = {};
      for (const ev of events) {
        const d = new Date(ev.date);
        if (Number.isNaN(d.getTime())) continue;
        const key = dateKey(d);
        (grouped[key] = grouped[key] || []).push(toTimelineItem(ev));
      }
      setEventsByDate(grouped);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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

  const selectedEvents = eventsByDate[selectedDate] || [];
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
            const hasEvents = formattedDate && eventsByDate[formattedDate];
            const isSelected = formattedDate === selectedDate;
            const isToday = formattedDate === todayKey;

            return (
              <div key={index} className="aspect-square p-0.5">
                {day ? (
                  <button
                    onClick={() => handleDateClick(day)}
                    className={`w-full h-full flex flex-col items-center justify-center rounded-lg text-sm font-medium transition-all relative ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-md'
                        : isToday
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 bg-white border border-gray-100 shadow-sm'
                    }`}
                  >
                    {day}
                    {hasEvents && (
                      <div className="absolute bottom-1.5 flex gap-0.5">
                        <span className={`h-1 w-1 rounded-full ${isSelected ? 'bg-white' : 'bg-indigo-400'}`}></span>
                      </div>
                    )}
                  </button>
                ) : (
                  <div className="w-full h-full"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Pane: The Daily Timeline */}
      <div className="flex-1 p-6 bg-white overflow-y-auto">
        <div className="mb-6 border-b border-gray-100 pb-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Schedule for</h3>
          <p className="text-2xl font-black tracking-tight text-gray-900 mt-1">
            {new Date(`${selectedDate}T00:00:00`).toLocaleDateString(undefined, {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 py-10 text-sm text-gray-400">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading your schedule…
          </div>
        ) : selectedEvents.length > 0 ? (
          <DailyTimeline schedule={selectedEvents} />
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <CalendarIcon className="h-6 w-6 text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-900">No scheduled events</p>
            <p className="text-xs text-gray-500 mt-1">Upload a timetable via the Override Engine.</p>
          </div>
        )}
      </div>
    </div>
  );
}
