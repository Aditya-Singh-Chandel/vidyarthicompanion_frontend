'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, Settings } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="inline-flex items-center gap-2 text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
            <Settings className="h-7 w-7 text-indigo-600" /> Settings
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account credentials — username, email, and password.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center rounded-2xl border border-gray-200 bg-white py-24 text-sm text-gray-400 shadow-sm">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading your settings…
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <SettingsPanel profile={profile} />
          </div>
        )}
      </div>
    </div>
  );
}
