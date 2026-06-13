import React from 'react';
import OverrideWidget from '@/features/overrideEngine/OverrideWidget';
import ExpenseWidget from '@/features/pocketBuddy/ExpenseWidget';
import RetrievalWidget from '@/features/retrievalEngine/RetrievalWidget';
import CommunityConsensusWidget from '@/features/communityEngine/CommunityConsensusWidget';
import TransitWidget from '@/features/transitEngine/TransitWidget';
import EmpathyWidget from '@/features/empathyMesh/EmpathyWidget';
import SynergyWidget from '@/features/recommendationEngine/SynergyWidget';
import PresenceTracker from '@/features/presenceEngine/PresenceTracker';
import DailyTimeline from '@/components/DailyTimeline';

const MOCK_TODAY_SCHEDULE = [
  {
    id: '1',
    title: 'Data Structures & Algorithms',
    time: '10:00 AM - 11:30 AM',
    location: 'Lecture Hall 4',
    type: 'academic',
  },
  {
    id: '2',
    title: 'Lunch at Main Mess',
    time: '12:30 PM - 1:15 PM',
    location: 'Campus Mess Block B',
    type: 'wellness',
    isFlagged: true, 
  },
  {
    id: '3',
    title: 'Hackathon Sync',
    time: '3:00 PM - 4:00 PM',
    location: 'Library Group Room 2',
    type: 'community',
  },
  {
    id: '4',
    title: 'Operating Systems Midterm',
    time: '4:30 PM - 6:30 PM',
    location: 'Auditorium A',
    type: 'academic',
  }
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-8">
      {/* The Silent GPS Engine */}
      <PresenceTracker />

      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            CampusFlow
          </h1>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold">
            S
          </div>
        </div>

        {/* The Brain: Ground-Truth Retrieval Engine */}
        <RetrievalWidget />

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
            <CommunityConsensusWidget />
            <SynergyWidget />
          </section>

          {/* Right Column: Financial & Wellness */}
          <section aria-labelledby="financial-wellness-heading">
            <h2
              id="financial-wellness-heading"
              className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500"
            >
              Financial & Wellness
            </h2>
            <ExpenseWidget />
            <EmpathyWidget />
            <TransitWidget />
          </section>
        </div>

        {/* Bottom Section: The Daily Master State */}
        <div className="mt-12">
          <section aria-labelledby="timeline-heading">
            <div className="mb-4 flex items-center justify-between">
              <h2
                id="timeline-heading"
                className="text-sm font-semibold uppercase tracking-wide text-gray-500"
              >
                Today's Flow
              </h2>
              <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                Live Baseline
              </span>
            </div>
            
            <div className="max-w-3xl">
              <DailyTimeline schedule={MOCK_TODAY_SCHEDULE} />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}