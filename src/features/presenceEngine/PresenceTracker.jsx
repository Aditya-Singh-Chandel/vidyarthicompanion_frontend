'use client';

import { useEffect, useRef } from 'react';
import { pingPresence } from './presenceApi';

export default function PresenceTracker() {
  const hasPinged = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !("geolocation" in navigator)) {
      console.warn("Geolocation is not supported by this browser.");
      return;
    }

    const captureAndPing = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          pingPresence(latitude, longitude, "student_1");
        },
        (error) => {
          console.warn("Location access denied or unavailable:", error.message);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    };

    // 1. Ping immediately when the dashboard loads (only once per mount)
    if (!hasPinged.current) {
      captureAndPing();
      hasPinged.current = true;
    }

    // 2. Set up a background interval to ping every 5 minutes (300,000 ms)
    const intervalId = setInterval(captureAndPing, 300000);

    // Cleanup interval if the user leaves the page
    return () => clearInterval(intervalId);
  }, []);

  // This is a "Silent Component" – it renders absolutely nothing to the UI.
  return null;
}