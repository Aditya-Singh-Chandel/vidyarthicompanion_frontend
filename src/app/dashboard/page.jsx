import React from 'react';
import OverrideWidget from '@/features/overrideEngine/OverrideWidget';
import RetrievalWidget from '@/features/retrievalEngine/RetrievalWidget';
import WellnessTracker from '@/features/wellnessTracker/WellnessTracker';
import PresenceTracker from '@/features/presenceEngine/PresenceTracker';
import MasterCalendar from '@/components/MasterCalendar';
import DailyPlanWidget from '@/features/routineEngine/DailyPlanWidget';
import NotificationsWidget from '@/features/routineEngine/NotificationsWidget';
import DashboardRecommendation from '@/features/pocketBuddy/DashboardRecommendation';

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <PresenceTracker />

      <div className="mx-auto max-w-5xl">
        {/* The Brain: Ground-Truth Retrieval Engine */}
        <RetrievalWidget />

        {/* The Orchestrator: prioritized daily plan */}
        <div className="mb-8">
          <DailyPlanWidget />
        </div>

        {/* Top Grid: Urgent Actions & Interventions */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          
          {/* Left Column: Action Center */}
          <section aria-labelledby="action-center-heading" className="flex flex-col">
            <h2
              id="action-center-heading"
              className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500"
            >
              Action Center
            </h2>
            <OverrideWidget />
          </section>

          {/* Right Column: Notifications */}
          <section aria-labelledby="notifications-heading">
            <h2
              id="notifications-heading"
              className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500"
            >
              Notifications
            </h2>
            <NotificationsWidget />

            {/* Compact Wallet-vs-Wellness nudge; full card lives in PocketBuddy */}
            <div className="mt-6">
              <DashboardRecommendation />
            </div>
          </section>
        </div>

        {/* Wellness Tracker & Burnout Score (full-width: side-by-side gauges) */}
        <div className="mt-8">
          <section aria-labelledby="wellness-heading">
            <h2
              id="wellness-heading"
              className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500"
            >
              Wellness &amp; Burnout
            </h2>
            <WellnessTracker />
          </section>
        </div>

        {/* Bottom Section: The Master Schedule Hub */}
        <div className="mt-12">
          <section aria-labelledby="calendar-heading">
            <div className="mb-4 flex items-center justify-between">
              <h2
                id="calendar-heading"
                className="text-sm font-semibold uppercase tracking-wide text-gray-500"
              >
                Master Schedule
              </h2>
              <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                Synced with AI Override
              </span>
            </div>
            
            {/* The New Interactive Calendar Hub */}
            <MasterCalendar />
          </section>
        </div>
      </div>
    </main>
  );
}