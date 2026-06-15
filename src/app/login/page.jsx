'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn, Loader2, Compass } from 'lucide-react';
import { useAuth } from '@/features/authEngine/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login({ email, password });
      router.replace('/dashboard');
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* ---------- Cinematic landscape panel ---------- */}
      <aside className="relative hidden overflow-hidden lg:block">
        <svg
          viewBox="0 0 800 1000"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="loginSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f0c089" />
              <stop offset="0.5" stopColor="#d98a45" />
              <stop offset="1" stopColor="#9c5526" />
            </linearGradient>
          </defs>
          <rect width="800" height="1000" fill="url(#loginSky)" />
          <circle cx="560" cy="240" r="96" fill="#fff6e3" opacity="0.85" />
          <path d="M0 560 L160 430 L300 540 L460 400 L620 540 L800 430 L800 1000 L0 1000 Z" fill="#8a4327" opacity="0.55" />
          <path d="M0 680 L180 560 L360 660 L520 540 L700 660 L800 600 L800 1000 L0 1000 Z" fill="#5c331a" opacity="0.8" />
          {/* citadel silhouette */}
          <g fill="#3a2010">
            <rect x="330" y="470" width="34" height="150" />
            <rect x="376" y="430" width="42" height="190" />
            <rect x="430" y="490" width="30" height="130" />
            <polygon points="347,430 330,470 364,470" />
            <polygon points="397,392 376,430 418,430" />
          </g>
          <path d="M0 760 C200 700 420 760 600 730 C700 715 800 740 800 740 L800 1000 L0 1000 Z" fill="#2b1610" />
        </svg>

        <div className="absolute inset-0 flex flex-col justify-between p-12 text-[#fff7ec]">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <Compass className="h-5 w-5" />
            </span>
            <span className="font-display text-xl font-semibold tracking-tight">CampusFlow</span>
          </div>
          <div className="max-w-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
              AI OS for Student Life
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-tight">
              Where your day finds its <em className="text-[#ffe2b8]">rhythm</em>.
            </h2>
            <p className="mt-4 text-sm text-white/80">
              Schedules, wellness, finances and community — orchestrated into one calm horizon.
            </p>
          </div>
        </div>
      </aside>

      {/* ---------- Form panel ---------- */}
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md cf-page-enter">
          <div className="mb-8 text-center lg:hidden">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-indigo-700">
              CampusFlow
            </h1>
            <p className="mt-2 text-sm text-gray-500">AI Operating System for Student Life</p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-[rgba(255,252,246,0.9)] p-8 shadow-[0_30px_70px_-40px_rgba(31,28,21,0.5)] backdrop-blur">
            <h2 className="mb-1 font-display text-2xl font-semibold text-gray-900">Welcome back</h2>
            <p className="mb-6 text-sm text-gray-500">Sign in to continue your journey.</p>

            {error && (
              <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm font-medium text-rose-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white/60 px-3.5 py-2.5 text-sm text-gray-900 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  placeholder="you@campusflow.in"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white/60 px-3.5 py-2.5 text-sm text-gray-900 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_36px_-16px_rgba(194,112,47,0.9)] transition-all hover:-translate-y-0.5 hover:bg-indigo-700 disabled:opacity-60"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
                {submitting ? 'Signing in…' : 'Sign in'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              New here?{' '}
              <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
