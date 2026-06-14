import React from 'react';
import CommunityConsensusWidget from '@/features/communityEngine/CommunityConsensusWidget';
import ScheduleConsensusWidget from '@/features/communityEngine/ScheduleConsensusWidget';
import NodesWidget from '@/features/communityEngine/NodesWidget';
import SynergyWidget from '@/features/recommendationEngine/SynergyWidget';

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Campus Community
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Real-time consensus, mess reviews, and batch synergies.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <section aria-labelledby="consensus-heading">
            <h2 id="consensus-heading" className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Live Votes
            </h2>
            <CommunityConsensusWidget />
          </section>

          <section aria-labelledby="synergy-heading">
            <h2 id="synergy-heading" className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Active Synergies
            </h2>
            <SynergyWidget />
          </section>
        </div>

        {/* Trust-weighted schedule verification lifecycle */}
        <section aria-labelledby="schedule-consensus-heading" className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h2
              id="schedule-consensus-heading"
              className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500"
            >
              Schedule Verification
            </h2>
            <ScheduleConsensusWidget />
          </div>
          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Your Communities
            </h2>
            <NodesWidget />
          </div>
        </section>
      </div>
    </div>
  );
}