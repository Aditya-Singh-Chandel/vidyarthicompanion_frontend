'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, LayoutDashboard, Sparkles, Users } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

const STEPS = [
  {
    step: '01',
    title: 'Land & Discover',
    desc: 'Aurora hero with living particle mesh and AI-powered navigation',
    href: '/',
    icon: Sparkles,
    preview: 'surface-aurora',
    label: 'Home',
  },
  {
    step: '02',
    title: 'Explore Features',
    desc: 'Interactive cards with mouse-tracking glow and reveal animations',
    href: '/features',
    icon: Users,
    preview: 'bg-gradient-to-br from-[var(--mist)] to-white',
    label: 'Features',
  },
  {
    step: '03',
    title: 'Enter Dashboard',
    desc: 'Glassmorphic widgets, live indicators, and AI-driven insights',
    href: '/dashboard',
    icon: LayoutDashboard,
    preview: 'bg-gradient-to-br from-white to-[var(--mist)]',
    label: 'Dashboard',
  },
];

export default function JourneySection() {
  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="mb-12 text-center">
            <Badge variant="teal">User Journey</Badge>
            <h2 className="text-headline mt-4 text-[var(--text-primary)]">
              One ecosystem, <span className="cf-gradient-text">seamless flow</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--text-secondary)]">
              Scroll, click, and transition — every screen shares the same design language and kinetic depth.
            </p>
          </div>
        </ScrollReveal>

        <div className="relative grid gap-6 md:grid-cols-3">
          {/* Animated gradient connector line */}
          <div className="journey-line absolute left-[16.67%] right-[16.67%] top-24 hidden md:block" />

          {STEPS.map((item, i) => {
            const Icon = item.icon;
            return (
              <ScrollReveal key={item.step} delay={i * 120}>
                <Link href={item.href} className="group block">
                  <div className="aurora-card overflow-hidden p-0 transition-all duration-500 group-hover:ring-2 group-hover:ring-[var(--brand)]">
                    <div className={`${item.preview} relative h-36 overflow-hidden p-4`}>
                      <div className="orb orb-brand -left-4 top-0 h-24 w-24" />
                      <div className="orb orb-purple right-0 bottom-0 h-20 w-20" />
                      <div className="relative flex h-full flex-col justify-between">
                        <span className="text-mono-data text-xs font-bold text-[var(--brand)]">{item.step}</span>
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5 text-[var(--brand-2)]" />
                          <span className="text-sm font-bold text-[var(--text-primary)]">{item.label}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-title text-[var(--text-primary)]">{item.title}</h3>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">{item.desc}</p>
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[var(--brand)] transition-all group-hover:gap-2">
                        Continue <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
