'use client';

import React, { useState, useEffect } from 'react';
import RecommendationCard from './RecommendationCard';
import { getRecommendation } from './pocketApi';

/**
 * Dashboard surface for the Wallet-vs-Wellness nudge. Reads the Mess community
 * meal votes + budget and renders the "eat in / eat out / conserve" card so the
 * recommendation is visible without opening PocketBuddy.
 */
export default function DashboardRecommendation() {
  const [rec, setRec] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const r = await getRecommendation();
      if (cancelled) return;
      setRec(r);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return <RecommendationCard rec={rec} loading={loading} />;
}
