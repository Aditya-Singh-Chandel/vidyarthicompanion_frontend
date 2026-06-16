'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Calendar, Bell, HeartPulse, Sparkles, Brain, Zap } from 'lucide-react';
import OverrideWidget from '@/features/overrideEngine/OverrideWidget';
import RetrievalWidget from '@/features/retrievalEngine/RetrievalWidget';
import WellnessTracker from '@/features/wellnessTracker/WellnessTracker';
import PresenceTracker from '@/features/presenceEngine/PresenceTracker';
import MasterCalendar from '@/components/MasterCalendar';
import DailyPlanWidget from '@/features/routineEngine/DailyPlanWidget';
import NotificationsWidget from '@/features/routineEngine/NotificationsWidget';
import DashboardRecommendation from '@/features/pocketBuddy/DashboardRecommendation';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 5) return { text: 'Night owl mode', emoji: '🌙', period: 'night' };
  if (hour < 12) return { text: 'Good morning', emoji: '☀️', period: 'morning' };
  if (hour < 17) return { text: 'Good afternoon', emoji: '🌤️', period: 'afternoon' };
  if (hour < 21) return { text: 'Good evening', emoji: '🌆', period: 'evening' };
  return { text: 'Night owl mode', emoji: '🌙', period: 'night' };
}

function SectionHeader({ icon: Icon, title, badge, id, children }) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--brand)]/10">
          <Icon className="h-4 w-4 text-[var(--brand)]" />
        </div>
        <h2
          id={id}
          className="section-label pulse-indicator"
        >
          {title}
        </h2>
        {badge && (
          <span className="text-[10px] font-semibold text-[var(--brand)] bg-[var(--brand)]/8 px-2.5 py-1 rounded-full border border-[var(--brand)]/15">
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function WidgetContainer({ children, className = '', delay = 0 }) {
  return (
    <div
      className={`widget-card p-5 ${className}`}
      data-reveal
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function DashboardPage() {
  const [greeting, setGreeting] = useState(getGreeting());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setGreeting(getGreeting());
    setMounted(true);
    const interval = setInterval(() => setGreeting(getGreeting()), 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen p-4 sm:p-8">
      <PresenceTracker />

      <div className="mx-auto max-w-5xl">
        {/* ─── Animated Greeting Header ─── */}
        <header className={`mb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} data-reveal>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--brand)]/15 to-[var(--brand-2)]/15 text-lg">
              {greeting.emoji}
            </div>
            <span className="section-label">{greeting.text}</span>
          </div>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-gray-900">
            Here&rsquo;s your{' '}
            <span className="cf-gradient-text">day</span>
            <span className="inline-block ml-2 animate-float">
              <Sparkles className="h-7 w-7 text-[var(--brand-2)] opacity-60" />
            </span>
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Your campus, orchestrated by AI. Everything you need, at a glance.
          </p>
        </header>

        {/* ─── AI Search / Retrieval Engine ─── */}
        <WidgetContainer delay={100}>
          <SectionHeader icon={Brain} title="AI Brain" badge="Live">
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-[var(--brand-3)]">
              <Zap className="h-3 w-3" />
              Powered by RAG
            </div>
          </SectionHeader>
          <RetrievalWidget />
        </WidgetContainer>

        {/* ─── Daily Plan ─── */}
        <div className="mt-6">
          <WidgetContainer delay={200}>
            <SectionHeader icon={Calendar} title="Today's Plan" badge="AI Orchestrated" />
            <DailyPlanWidget />
          </WidgetContainer>
        </div>

        {/* ─── Action Center + Notifications Grid ─── */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Left: Action Center */}
          <WidgetContainer delay={300} className="flex flex-col">
            <SectionHeader icon={Activity} title="Action Center" id="action-center-heading" />
            <OverrideWidget />
          </WidgetContainer>

          {/* Right: Notifications + Budget Nudge */}
          <div className="flex flex-col gap-6">
            <WidgetContainer delay={400}>
              <SectionHeader icon={Bell} title="Notifications" id="notifications-heading" />
              <NotificationsWidget />
            </WidgetContainer>

            <WidgetContainer delay={500}>
              <DashboardRecommendation />
            </WidgetContainer>
          </div>
        </div>

        {/* ─── Wellness & Burnout ─── */}
        <div className="mt-6">
          <WidgetContainer delay={600}>
            <SectionHeader icon={HeartPulse} title="Wellness & Burnout" id="wellness-heading" />
            <WellnessTracker />
          </WidgetContainer>
        </div>

        {/* ─── Master Schedule ─── */}
        <div className="mt-6 mb-8">
          <WidgetContainer delay={700}>
            <SectionHeader
              icon={Calendar}
              title="Master Schedule"
              id="calendar-heading"
              badge="Synced with AI Override"
            />
            <MasterCalendar />
          </WidgetContainer>
        </div>
      </div>
    </main>
  );
}