'use client';

import React from 'react';
import { BookOpen, Users, Coffee, MapPin, Clock } from 'lucide-react';

const typeConfig = {
  academic: {
    icon: BookOpen,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    ringColor: 'ring-indigo-50',
  },
  community: {
    icon: Users,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    ringColor: 'ring-purple-50',
  },
  wellness: {
    icon: Coffee,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
    ringColor: 'ring-emerald-50',
  },
};

export default function DailyTimeline({ schedule = [] }) {
  if (!schedule || schedule.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
        <p className="text-sm font-medium text-gray-500">No scheduled events today.</p>
        <p className="mt-1 text-xs text-gray-400">Your routines are clear. Take a breath.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flow-root">
        <ul role="list" className="-mb-8">
          {schedule.map((event, eventIdx) => {
            const isLast = eventIdx === schedule.length - 1;
            const config = typeConfig[event.type] || typeConfig.academic;
            const Icon = config.icon;

            return (
              <li key={event.id}>
                <div className="relative pb-8">
                  {!isLast ? (
                    <span
                      className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex items-start space-x-4">
                    {/* Icon Bubble */}
                    <div className="relative">
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-full ring-8 ${config.ringColor} ${config.bgColor}`}
                      >
                        <Icon className={`h-5 w-5 ${config.color}`} aria-hidden="true" />
                      </span>
                    </div>

                    {/* Event Details */}
                    <div className="min-w-0 flex-1 py-1.5">
                      <div className="text-sm text-gray-500">
                        <span className="font-medium text-gray-900">{event.title}</span>
                      </div>
                      
                      <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:gap-4">
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="mr-1.5 h-3.5 w-3.5 shrink-0 text-gray-400" />
                          {event.time}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <MapPin className="mr-1.5 h-3.5 w-3.5 shrink-0 text-gray-400" />
                          {event.location}
                        </div>
                      </div>
                      
                      {event.isFlagged && (
                        <span className="mt-2 inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                          Consensus Flag: Overcrowded
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}