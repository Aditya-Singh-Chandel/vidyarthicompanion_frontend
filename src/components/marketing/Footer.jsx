'use client';

import React from 'react';
import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';
import { useOverlay } from '@/components/overlays/OverlayContext';

export default function Footer() {
  const { openPanel } = useOverlay();

  return (
    <footer className="relative border-t border-[var(--cloud)] bg-[var(--surface)] px-4 py-12 sm:px-6 overflow-hidden">
      {/* Subtle aurora glow at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--brand)] to-transparent opacity-40" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-[var(--brand)] opacity-[0.04] blur-[60px] pointer-events-none" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:justify-between">
        <div>
          <BrandLogo size="sm" showTagline />
          <p className="mt-3 max-w-xs text-sm text-[var(--text-secondary)]">
            Your campus intelligence layer — schedules, community, and finances in one fluid flow.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div>
            <h4 className="text-label mb-3 text-[var(--text-secondary)]">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-[var(--text-secondary)] transition-colors hover:text-[var(--brand)]">Home</Link></li>
              <li><Link href="/features" className="text-[var(--text-secondary)] transition-colors hover:text-[var(--brand)]">Features</Link></li>
              <li><Link href="/dashboard" className="text-[var(--text-secondary)] transition-colors hover:text-[var(--brand)]">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-label mb-3 text-[var(--text-secondary)]">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/login" className="text-[var(--text-secondary)] transition-colors hover:text-[var(--brand)]">Sign in</Link></li>
              <li><Link href="/register" className="text-[var(--text-secondary)] transition-colors hover:text-[var(--brand)]">Register</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-label mb-3 text-[var(--text-secondary)]">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button type="button" onClick={() => openPanel('contact')} className="text-[var(--text-secondary)] transition-colors hover:text-[var(--brand)]">
                  Contact
                </button>
              </li>
              <li>
                <button type="button" onClick={() => openPanel('settings')} className="text-[var(--text-secondary)] transition-colors hover:text-[var(--brand)]">
                  Settings
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-6xl text-center text-xs text-[var(--text-secondary)]">
        VidyarthiCompanion · Aurora Design System
      </p>
    </footer>
  );
}
