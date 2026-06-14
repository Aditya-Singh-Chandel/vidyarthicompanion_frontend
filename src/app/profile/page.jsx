'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CalendarRange, UtensilsCrossed, Wallet, Loader2, Sparkles } from 'lucide-react';
import AcademicSetup from '@/features/profileEngine/AcademicSetup';
import MessSetup from '@/features/profileEngine/MessSetup';
import FinancialSetup from '@/features/profileEngine/FinancialSetup';
import { getProfile } from '@/features/profileEngine/profileApi';

const TABS = [
  { id: 'academic', label: 'Class Schedule', Icon: CalendarRange },
  { id: 'mess', label: 'Mess Menu', Icon: UtensilsCrossed },
  { id: 'financial', label: 'Expense Limits', Icon: Wallet },
];

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState('academic');

  const load = useCallback(async () => {
    const data = await getProfile();
    setProfile(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await getProfile();
      if (cancelled) return;
      setProfile(data);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">Profile</h1>
          <p className="mt-1 text-sm text-gray-500">
            Your ground-truth: official timetable, mess menu, and budget — the inputs CampusFlow and PocketBuddy run on.
          </p>
          {profile && !profile.aiEnabled && (
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">
              <Sparkles className="h-3.5 w-3.5" /> AI document parsing is off (no GEMINI_API_KEY) — manual entry still works.
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center rounded-2xl border border-gray-200 bg-white py-24 text-sm text-gray-400 shadow-sm">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading your profile…
          </div>
        ) : (
          <>
            <div className="mb-6 flex gap-2 rounded-xl border border-gray-200 bg-white p-1.5 shadow-sm">
              {TABS.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${
                    tab === id ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
              {tab === 'academic' && <AcademicSetup profile={profile} onSaved={load} />}
              {tab === 'mess' && <MessSetup profile={profile} onSaved={load} />}
              {tab === 'financial' && <FinancialSetup profile={profile} onSaved={load} />}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
