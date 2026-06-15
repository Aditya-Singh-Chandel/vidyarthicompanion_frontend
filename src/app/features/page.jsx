'use client';

import React from 'react';
import {
  Brain,
  Calendar,
  HeartPulse,
  Shield,
  Users,
  Wallet,
  Zap,
  MessageSquare,
  Route,
} from 'lucide-react';
import MarketingLayout from '@/components/marketing/MarketingLayout';
import JourneySection from '@/components/marketing/JourneySection';
import ScrollReveal from '@/components/ScrollReveal';
import FeatureCard from '@/components/ui/FeatureCard';
import Badge from '@/components/ui/Badge';

const FEATURES = [
  {
    icon: Brain,
    title: 'Ground-Truth AI',
    description: 'Ask anything about your schedule, budget, or campus — powered by live retrieval.',
    badge: 'Core',
    span: 'wide',
    accent: 'teal',
    details: 'The retrieval engine connects to your real calendar, wallet, and community data. Responses cite verified sources with confidence scores.',
  },
  {
    icon: Calendar,
    title: 'Override Engine',
    description: 'Upload, paste, or type timetables. AI extracts events and runs trust-weighted verification.',
    badge: 'Smart',
    span: 'tall',
    accent: 'saffron',
    details: 'Supports images, PDF, CSV, and ICS. Extracted events flow into community consensus before syncing to your master calendar.',
  },
  {
    icon: HeartPulse,
    title: 'Wellness Mesh',
    description: 'Burnout gauges and empathy interventions that adapt to your stress patterns.',
    badge: 'Health',
    span: 'normal',
    accent: 'teal',
    details: 'Real-time burnout scoring from schedule density, sleep gaps, and self-reported mood. Gentle nudges, not nagging.',
  },
  {
    icon: Wallet,
    title: 'PocketBuddy',
    description: 'INR budgeting with Amazon Pay integration and spending breakdowns.',
    badge: 'Finance',
    span: 'normal',
    accent: 'saffron',
    details: 'Capture transactions via voice or quick-add. AI recommends when to skip the canteen and cook at the mess.',
  },
  {
    icon: Users,
    title: 'Community Consensus',
    description: 'Live votes, schedule verification, and batch synergies in one panel.',
    badge: 'Social',
    span: 'normal',
    accent: 'teal',
    details: 'CRs post schedule changes; students vote with trust weights. Conflicts surface in a slide-out sync modal.',
  },
  {
    icon: Route,
    title: 'Transit Engine',
    description: 'Campus route planning with real-time crowding and mess-hour avoidance.',
    badge: 'Mobility',
    span: 'normal',
    accent: 'teal',
    details: 'Integrates with your daily plan to suggest departure times that account for Mumbai monsoon delays.',
  },
  {
    icon: Shield,
    title: 'Privacy Controls',
    description: 'Granular toggles for what your community sees — wellness stays personal.',
    badge: 'Trust',
    span: 'normal',
    accent: 'saffron',
    details: 'Open settings as an overlay anytime. No full-page reload, no lost scroll position.',
  },
  {
    icon: MessageSquare,
    title: 'Zero-UI Actions',
    description: 'Verify or flag AI-extracted events with one tap — no forms required.',
    badge: 'Fast',
    span: 'wide',
    accent: 'teal',
    details: 'Action cards surface on the dashboard with confidence scores. Safe-skip activates automatically for low-trust events.',
  },
  {
    icon: Zap,
    title: 'Daily Orchestrator',
    description: 'Auto-prioritized plan: exams first, then deadlines, classes, and wellbeing.',
    badge: 'Live',
    span: 'normal',
    accent: 'saffron',
    details: 'Live clock syncs with backend horizon filtering. Budget-critical days get saffron urgency badges.',
  },
];

export default function FeaturesPage() {
  return (
    <MarketingLayout>
      <section className="relative px-4 pt-28 pb-12 sm:px-6">
        <div className="orb orb-teal right-[5%] top-20 h-48 w-48 opacity-20" />
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <Badge variant="teal">Features</Badge>
            <h1 className="text-display mt-4 max-w-3xl text-[var(--text-primary)]">
              Asymmetric grid,
              <span className="text-[var(--teal)]"> dynamic depth</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base text-[var(--text-secondary)]">
              Hover to lift cards. Click Explore to expand inline — no page reload. Every component reuses the Midnight Monsoon design system.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid auto-rows-fr grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, i) => (
              <ScrollReveal key={feature.title} delay={(i % 3) * 80}>
                <FeatureCard {...feature} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <JourneySection />
    </MarketingLayout>
  );
}
