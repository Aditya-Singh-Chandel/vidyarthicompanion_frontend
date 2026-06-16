'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CalendarRange, UtensilsCrossed, Wallet, Loader2, Sparkles, Users2, User, Shield } from 'lucide-react';
import AcademicSetup from '@/features/profileEngine/AcademicSetup';
import MessSetup from '@/features/profileEngine/MessSetup';
import FinancialSetup from '@/features/profileEngine/FinancialSetup';
import CommunitiesSetup from '@/features/profileEngine/CommunitiesSetup';
import { getProfile } from '@/features/profileEngine/profileApi';

const TABS = [
  { id: 'academic', label: 'Class Schedule', Icon: CalendarRange },
  { id: 'mess', label: 'Mess Menu', Icon: UtensilsCrossed },
  { id: 'financial', label: 'Expense Limits', Icon: Wallet },
  { id: 'communities', label: 'Fixed Communities', Icon: Users2 },
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
    <div className="min-h-screen p-4 sm:p-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-6 cf-page-enter">
          {profile?.username ? (
            <div className="mb-4 flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[var(--brand-2)] text-xl font-black text-white shadow-[0_12px_28px_-6px_rgba(109,94,252,0.7)] transition-transform hover:scale-105">
                {(profile.username || 'S').charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
                  @{profile.username}
                </h1>
                <p className="truncate text-sm text-[var(--text-secondary)]">
                  {profile.name}
                  {profile.email ? ` · ${profile.email}` : ''}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--brand)]/15 to-[var(--brand-2)]/15">
                <User className="h-5 w-5 text-[var(--brand)]" />
              </div>
              <h1 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">Profile</h1>
            </div>
          )}
          <p className="text-sm text-[var(--text-secondary)]">
            Your ground-truth data: timetable, mess menu, and budget — the inputs AI runs on.
          </p>
          {profile && !profile.aiEnabled && (
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-amber-50/60 px-3 py-1.5 text-xs font-medium text-amber-700 backdrop-blur-md border border-amber-200/40">
              <Sparkles className="h-3.5 w-3.5" /> AI document parsing is off (no GEMINI_API_KEY) — manual entry still works.
            </p>
          )}
        </header>

        {loading ? (
          <div className="flex items-center justify-center rounded-[var(--radius-2xl)] border border-white/60 bg-white/50 py-24 text-sm text-gray-400 backdrop-blur-md shadow-[var(--shadow-float)]">
            <Loader2 className="mr-2 h-5 w-5 animate-spin text-[var(--brand)]" /> Loading your profile…
          </div>
        ) : (
          <>
            {/* Tab bar */}
            <div className="mb-6 flex gap-1.5 rounded-2xl border border-white/60 bg-white/50 p-1.5 backdrop-blur-md shadow-[var(--shadow-float)]">
              {TABS.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-300 ${
                    tab === id
                      ? 'bg-gradient-to-r from-[var(--brand)] to-[var(--brand-dark)] text-white shadow-[0_10px_24px_-8px_rgba(109,94,252,0.6)]'
                      : 'text-gray-600 hover:bg-[var(--brand)]/5 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>

            {/* Content card */}
            <div className="widget-card p-5 sm:p-6 animate-scale-in">
              {tab === 'academic' && <AcademicSetup profile={profile} onSaved={load} />}
              {tab === 'mess' && <MessSetup profile={profile} onSaved={load} />}
              {tab === 'financial' && <FinancialSetup profile={profile} onSaved={load} />}
              {tab === 'communities' && <CommunitiesSetup profile={profile} onSaved={load} />}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
