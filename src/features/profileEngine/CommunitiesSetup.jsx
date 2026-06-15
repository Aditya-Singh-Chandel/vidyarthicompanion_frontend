'use client';

import React, { useState } from 'react';
import { Utensils, Dumbbell, GraduationCap, HeartPulse, Loader2, Check, Users2 } from 'lucide-react';
import { updateFinancial } from './profileApi';

/**
 * "Your fixed communities" — pins the user's primary Mess / Gym / Class /
 * Empathy communities to the top of the Communities page and feeds the
 * dashboard nudges. Lives in its own profile tab (beside Expense Limits).
 */
export default function CommunitiesSetup({ profile, onSaved }) {
  const [primaryMessNodeId, setPrimaryMessNodeId] = useState(profile?.primaryMessNodeId ?? '');
  const [primaryGymNodeId, setPrimaryGymNodeId] = useState(profile?.primaryGymNodeId ?? '');
  const [primaryClassNodeId, setPrimaryClassNodeId] = useState(profile?.primaryClassNodeId ?? '');
  const [primaryEmpathyNodeId, setPrimaryEmpathyNodeId] = useState(profile?.primaryEmpathyNodeId ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const messCommunities = profile?.messCommunities ?? [];
  const gymCommunities = profile?.gymCommunities ?? [];
  const classCommunities = profile?.classCommunities ?? [];
  const empathyCommunities = profile?.empathyCommunities ?? [];

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    const res = await updateFinancial({
      primaryMessNodeId: primaryMessNodeId || null,
      primaryGymNodeId: primaryGymNodeId || null,
      primaryClassNodeId: primaryClassNodeId || null,
      primaryEmpathyNodeId: primaryEmpathyNodeId || null,
    });
    setSaving(false);
    if (res) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      onSaved?.(res);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Users2 className="h-4 w-4 text-indigo-600" /> Your fixed communities
        </p>
        <p className="mt-1 text-xs text-gray-400">
          These choices pin <span className="font-semibold text-gray-500">Mess</span>,{' '}
          <span className="font-semibold text-gray-500">Class</span> and{' '}
          <span className="font-semibold text-gray-500">Empathy Mesh</span> to the top of your Communities page and
          power the food &amp; timetable nudges across the app.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Utensils className="h-4 w-4 text-amber-600" /> Primary Mess community
          </label>
          <select
            value={primaryMessNodeId}
            onChange={(e) => setPrimaryMessNodeId(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="">None selected</option>
            {messCommunities.map((c) => (
              <option key={c.nodeId} value={c.nodeId}>
                {c.name}
              </option>
            ))}
          </select>
          {messCommunities.length === 0 && (
            <p className="mt-1 text-[11px] text-gray-400">Join a Mess community to enable food nudges.</p>
          )}
        </div>
        <div>
          <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Dumbbell className="h-4 w-4 text-indigo-600" /> Primary Gym community
          </label>
          <select
            value={primaryGymNodeId}
            onChange={(e) => setPrimaryGymNodeId(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="">None selected</option>
            {gymCommunities.map((c) => (
              <option key={c.nodeId} value={c.nodeId}>
                {c.name}
              </option>
            ))}
          </select>
          {gymCommunities.length === 0 && (
            <p className="mt-1 text-[11px] text-gray-400">Join a Gym community for protein/fuel tips.</p>
          )}
        </div>
        <div>
          <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-gray-700">
            <GraduationCap className="h-4 w-4 text-violet-600" /> Primary Class community
          </label>
          <select
            value={primaryClassNodeId}
            onChange={(e) => setPrimaryClassNodeId(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="">None selected</option>
            {classCommunities.map((c) => (
              <option key={c.nodeId} value={c.nodeId}>
                {c.name}
              </option>
            ))}
          </select>
          {classCommunities.length === 0 && (
            <p className="mt-1 text-[11px] text-gray-400">Join a Class community to sync the timetable.</p>
          )}
        </div>
        <div>
          <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-gray-700">
            <HeartPulse className="h-4 w-4 text-emerald-600" /> Empathy Mesh
          </label>
          <select
            value={primaryEmpathyNodeId}
            onChange={(e) => setPrimaryEmpathyNodeId(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="">None selected</option>
            {empathyCommunities.map((c) => (
              <option key={c.nodeId} value={c.nodeId}>
                {c.name}
              </option>
            ))}
          </select>
          {empathyCommunities.length === 0 && (
            <p className="mt-1 text-[11px] text-gray-400">Join an Empathy Mesh for wellbeing nudges &amp; Meet Ups.</p>
          )}
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : null}
        {saved ? 'Saved' : 'Save fixed communities'}
      </button>
    </div>
  );
}
