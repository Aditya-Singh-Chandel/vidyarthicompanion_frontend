'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus, Loader2, Compass, Sparkles, CalendarCheck, Wallet, HeartPulse } from 'lucide-react';
import { useAuth } from '@/features/authEngine/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register({ name, username, email, password });
      router.replace('/dashboard');
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* ---------- Cinematic aurora panel ---------- */}
      <aside className="relative hidden overflow-hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1b1740] via-[#3b2c8f] to-[#0e1030]" />
        <span className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[#6d5efc] opacity-60 blur-[90px] cf-float" />
        <span
          className="absolute right-[-6rem] top-1/3 h-80 w-80 rounded-full bg-[#38c6e6] opacity-50 blur-[90px] cf-float"
          style={{ animationDelay: '1.5s' }}
        />
        <span
          className="absolute bottom-[-6rem] left-1/4 h-96 w-96 rounded-full bg-[#ff6bcb] opacity-40 blur-[100px] cf-float"
          style={{ animationDelay: '3s' }}
        />
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
            backgroundSize: '44px 44px',
            maskImage: 'radial-gradient(ellipse 70% 70% at 40% 40%, #000 30%, transparent 75%)',
          }}
        />

        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 backdrop-blur-md">
              <Compass className="h-5 w-5" />
            </span>
            <span className="font-display text-xl font-semibold tracking-tight">VidyarthiCompanion</span>
          </div>

          <div className="max-w-md">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" /> AI OS for Student Life
            </span>
            <h2 className="mt-5 font-display text-5xl font-semibold leading-[1.05]">
              Join the
              <br />
              <span className="bg-gradient-to-r from-[#a6a6ff] via-[#9b5cff] to-[#38c6e6] bg-clip-text text-transparent">
                future of campus.
              </span>
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-white/70">
              One account. Your schedules, wellness, finances and community — all orchestrated by AI.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {[
                { icon: CalendarCheck, label: 'Smart schedule' },
                { icon: HeartPulse, label: 'Wellness pulse' },
                { icon: Wallet, label: 'PocketBuddy' },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-3.5 py-2 text-sm text-white/90 backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/15"
                >
                  <Icon className="h-4 w-4 text-[#a6a6ff]" />
                  {label}
                </span>
              ))}
            </div>
          </div>

          <p className="text-xs text-white/50">Built for Amazon Hackon · Aurora Design System</p>
        </div>
      </aside>

      {/* ---------- Form panel ---------- */}
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md cf-page-enter">
          <div className="mb-8 text-center lg:hidden">
            <h1 className="font-display text-3xl font-semibold tracking-tight">
              <span className="cf-gradient-text">VidyarthiCompanion</span>
            </h1>
            <p className="mt-2 text-sm text-gray-500">AI Operating System for Student Life</p>
          </div>

          <div className="rounded-3xl border border-white/60 bg-white/60 p-8 shadow-[0_30px_70px_-35px_rgba(109,94,252,0.55)] backdrop-blur-xl">
            <h2 className="mb-1 font-display text-2xl font-semibold text-gray-900">Create your account</h2>
            <p className="mb-6 text-sm text-gray-500">Start your AI-powered campus experience.</p>

            {error && (
              <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-medium text-rose-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white/70 px-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/15"
                  placeholder="Isha Patel"
                />
              </div>

              <div>
                <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="flex items-center rounded-xl border border-gray-200 bg-white/70 shadow-sm focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/15">
                  <span className="pl-3.5 text-sm text-gray-400">@</span>
                  <input
                    id="username"
                    type="text"
                    required
                    minLength={3}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border-0 bg-transparent px-2 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-0"
                    placeholder="isha_patel"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white/70 px-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/15"
                  placeholder="you@vidyarthicompanion.in"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white/70 px-3.5 py-2.5 text-sm text-gray-900 shadow-sm transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/15"
                  placeholder="At least 6 characters"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--brand)] to-[var(--brand-dark)] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_38px_-14px_rgba(109,94,252,0.9)] transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_46px_-12px_rgba(109,94,252,1)] disabled:opacity-60"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
                {submitting ? 'Creating account…' : 'Create account'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-[var(--brand)] hover:text-[var(--brand-dark)]">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
