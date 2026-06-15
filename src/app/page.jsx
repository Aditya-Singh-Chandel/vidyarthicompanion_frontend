'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Brain, Calendar, Wallet, Zap } from 'lucide-react';
import MarketingLayout from '@/components/marketing/MarketingLayout';
import JourneySection from '@/components/marketing/JourneySection';
import ScrollReveal from '@/components/ScrollReveal';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

const FLOAT_STATS = [
  { value: '12k+', label: 'Schedules synced' },
  { value: '98%', label: 'AI accuracy' },
  { value: '₹2.4L', label: 'Saved monthly' },
];

export default function HomePage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="surface-ink relative min-h-screen overflow-hidden px-4 pt-28 pb-20 sm:px-6">
        <div className="orb orb-teal left-[10%] top-[20%] h-64 w-64 animate-float" />
        <div className="orb orb-saffron right-[15%] top-[30%] h-48 w-48 animate-float" style={{ animationDelay: '1s' }} />
        <div className="orb orb-teal bottom-[10%] right-[30%] h-56 w-56 opacity-15" />

        <div className="relative mx-auto max-w-6xl">
          <ScrollReveal>
            <Badge variant="saffron" className="mb-6 border-amber-500/30 bg-amber-500/10 text-[var(--saffron-bright)]">
              Midnight Monsoon · v1.0
            </Badge>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <h1 className="text-display max-w-4xl text-[var(--text-on-dark)]">
              Campus life,
              <br />
              <span className="text-[var(--teal-bright)]">illuminated</span>{' '}
              by AI.
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--text-muted-dark)]">
              VidyarthiCompanion is a fluid campus OS — deep twilight aesthetics, electric teal intelligence, and saffron sparks of action. Scroll to feel the motion.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/dashboard">
                <Button variant="primary" size="lg" icon={Zap}>
                  Open Dashboard
                </Button>
              </Link>
              <Link href="/features">
                <Button variant="outline" size="lg" className="border-[var(--teal-bright)] text-[var(--teal-bright)] hover:bg-[var(--teal)] hover:text-white">
                  Explore Features
                </Button>
              </Link>
            </div>
          </ScrollReveal>

          {/* Floating stat cards */}
          <div className="mt-16 grid gap-4 sm:grid-cols-3">
            {FLOAT_STATS.map((stat, i) => (
              <ScrollReveal key={stat.label} delay={400 + i * 100} direction="up">
                <div className="glass-dark rounded-[var(--radius-2xl)] p-5 transition-transform duration-500 hover:-translate-y-1">
                  <p className="text-mono-data text-2xl font-black text-[var(--saffron-bright)]">{stat.value}</p>
                  <p className="mt-1 text-sm text-[var(--text-muted-dark)]">{stat.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Morph preview: hero orb becomes feature header */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <div className="mb-12 flex items-end justify-between gap-4">
              <div>
                <span className="text-label text-[var(--teal)]">Continuity</span>
                <h2 className="text-headline mt-2 text-[var(--text-primary)]">
                  Elements morph across pages
                </h2>
              </div>
              <Link href="/features" className="hidden sm:block">
                <Button variant="ghost" size="sm" icon={ArrowRight}>See all</Button>
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: Brain, title: 'AI Brain', desc: 'Hero glow expands into the retrieval search bar on Dashboard', color: 'var(--teal)' },
              { icon: Calendar, title: 'Smart Calendar', desc: 'Floating orb transitions into the master schedule header', color: 'var(--saffron)' },
              { icon: Wallet, title: 'PocketBuddy', desc: 'Stat card morphs into live balance widget with progress rings', color: 'var(--teal-bright)' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <ScrollReveal key={item.title} delay={i * 150}>
                  <Card className="group relative overflow-hidden">
                    <div
                      className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-30 transition-transform duration-700 group-hover:scale-150"
                      style={{ background: `radial-gradient(circle, ${item.color} 0%, transparent 70%)` }}
                    />
                    <Icon className="h-8 w-8" style={{ color: item.color }} />
                    <h3 className="text-title mt-4 text-[var(--text-primary)]">{item.title}</h3>
                    <p className="mt-2 text-sm text-[var(--text-secondary)]">{item.desc}</p>
                  </Card>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      <JourneySection />

      {/* CTA */}
      <section className="px-4 py-20 sm:px-6">
        <ScrollReveal>
          <div className="surface-ink relative mx-auto max-w-6xl overflow-hidden rounded-[var(--radius-2xl)] px-8 py-16 text-center">
            <div className="orb orb-teal left-1/4 top-0 h-40 w-40" />
            <div className="orb orb-saffron right-1/4 bottom-0 h-32 w-32" />
            <div className="relative">
              <h2 className="text-headline text-[var(--text-on-dark)]">Ready to flow?</h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-[var(--text-muted-dark)]">
                Sign in once. Settings and contact slide in as overlays — you never lose your place.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Link href="/register">
                  <Button variant="accent" size="lg">Create account</Button>
                </Link>
                <Link href="/login">
                  <Button variant="ghost" size="lg" className="text-[var(--text-on-dark)] hover:bg-white/10">
                    Sign in
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </MarketingLayout>
  );
}
