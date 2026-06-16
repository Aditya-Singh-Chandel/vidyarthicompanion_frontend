'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, Settings, Shield } from 'lucide-react';
import SettingsPanel from '@/features/profileEngine/SettingsPanel';
import { getProfile } from '@/features/profileEngine/profileApi';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

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
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--brand)]/15 to-[var(--brand-2)]/15">
              <Settings className="h-5 w-5 text-[var(--brand)]" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">Settings</h1>
            <span className="flex items-center gap-1 text-[10px] font-semibold text-[var(--brand-2)] bg-[var(--brand-2)]/8 px-2.5 py-1 rounded-full border border-[var(--brand-2)]/15">
              <Shield className="h-3 w-3" /> Secure
            </span>
          </div>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Manage your account credentials — username, email, and password.
          </p>
        </header>

        {loading ? (
          <div className="flex items-center justify-center rounded-[var(--radius-2xl)] border border-white/60 bg-white/50 py-24 text-sm text-gray-400 backdrop-blur-md shadow-[var(--shadow-float)]">
            <Loader2 className="mr-2 h-5 w-5 animate-spin text-[var(--brand)]" /> Loading your settings…
          </div>
        ) : (
          <div className="widget-card p-5 sm:p-6 animate-scale-in">
            <SettingsPanel profile={profile} />
          </div>
        )}
      </div>
    </div>
  );
}
