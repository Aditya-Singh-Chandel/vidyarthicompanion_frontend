'use client';

import React, { useState, useEffect } from 'react';
import { Navigation, MapPin, Clock, ArrowRight } from 'lucide-react';
import { getDepartureTime } from './transitApi';

// Fallback used before the backend responds or if it is unreachable.
const FALLBACK_EVENT = {
  title: "Project Sync & Dinner",
  location: "SG Highway Cafe",
  time: "8:00 PM",
  transitMode: "Auto Rickshaw",
  estTravelTime: "35 mins",
  leaveIn: "25 mins",
  status: "warning" // 'safe', 'warning', 'critical'
};

// Placeholder event id until a real "next event" lookup is available.
const NEXT_EVENT_ID = "next";

export default function TransitWidget() {
  const [nextEvent, setNextEvent] = useState(FALLBACK_EVENT);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchDeparture = async (currentLocation) => {
      const data = await getDepartureTime(NEXT_EVENT_ID, currentLocation);
      if (cancelled) return;
      if (data?.success && data.data) {
        setNextEvent(data.data);
        setIsLive(true);
      }
    };

    // Use real coordinates when available, otherwise a campus default.
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchDeparture(`${pos.coords.latitude},${pos.coords.longitude}`),
        () => fetchDeparture("campus"),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 60000 }
      );
    } else {
      fetchDeparture("campus");
    }

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="rounded-xl border border-orange-200 bg-orange-50 p-6 shadow-sm mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold uppercase tracking-wide text-orange-800 flex items-center gap-2">
          <Navigation className="h-4 w-4" />
          Departure Alert
        </h3>
        <span className="animate-pulse rounded-full bg-orange-200 px-2.5 py-0.5 text-xs font-semibold text-orange-900">
          {isLive ? 'Live Tracking' : 'Estimating...'}
        </span>
      </div>

      {nextEvent.status === 'none' ? (
        <div className="rounded-lg bg-white p-4 shadow-sm border border-orange-100">
          <p className="text-sm font-bold text-gray-900">{nextEvent.title}</p>
          <p className="mt-1 text-xs text-gray-500">
            {nextEvent.message || 'No upcoming events to leave for.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-orange-900">Next Destination:</p>
            <p className="text-lg font-bold text-gray-900">{nextEvent.title}</p>
            <div className="mt-1 flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {nextEvent.location}</span>
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {nextEvent.time}</span>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm border border-orange-100">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Leave In</span>
              <span className="text-2xl font-black text-orange-600">{nextEvent.leaveIn}</span>
            </div>

            <ArrowRight className="h-5 w-5 text-gray-300 mx-2" />

            <div className="flex flex-col text-right">
              <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">By {nextEvent.transitMode}</span>
              <span className="text-lg font-bold text-gray-900">{nextEvent.estTravelTime}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}