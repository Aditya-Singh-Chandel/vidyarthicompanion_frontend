'use client';

import React from 'react';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import { Sparkles } from 'lucide-react';

export default function DashboardHero({ burnoutScore = 4, balance = 2400, itemsCount = 0 }) {
  return (
    <div className="relative mb-8 overflow-hidden rounded-[var(--radius-2xl)] bg-[var(--ink)] p-6 sm:p-8">
      <div className="orb orb-teal -left-8 top-0 h-40 w-40" />
      <div className="orb orb-saffron right-0 bottom-0 h-32 w-32" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Badge variant="saffron" className="mb-3 border-amber-500/30 bg-amber-500/10 text-[var(--saffron-bright)]">
            Live Dashboard
          </Badge>
          <h1 className="text-headline text-[var(--text-on-dark)]">
            Your monsoon
            <span className="text-[var(--teal-bright)]"> command center</span>
          </h1>
          <p className="mt-2 max-w-md text-sm text-[var(--text-muted-dark)]">
            Hero glow from Home morphs into this header. Everything below is interactive — forms, toggles, and live progress.
          </p>
          <Link
            href="/features"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--teal-bright)] transition-colors hover:text-[var(--teal)]"
          >
            <Sparkles className="h-4 w-4" /> Explore all features
          </Link>
        </div>

        <div className="grid w-full max-w-sm gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <div className="glass-dark rounded-[var(--radius-xl)] p-4">
            <ProgressBar value={100 - burnoutScore * 10} label="Wellness buffer" variant="teal" />
          </div>
          <div className="glass-dark rounded-[var(--radius-xl)] p-4">
            <p className="text-label text-[var(--text-muted-dark)]">Wallet left</p>
            <p className="text-mono-data mt-1 text-2xl font-black text-[var(--saffron-bright)]">
              ₹{Math.round(balance).toLocaleString('en-IN')}
            </p>
            <p className="mt-1 text-xs text-[var(--text-muted-dark)]">{itemsCount} items in horizon</p>
          </div>
        </div>
      </div>
    </div>
  );
}
