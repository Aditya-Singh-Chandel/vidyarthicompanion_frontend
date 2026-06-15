'use client';

import React from 'react';
import Link from 'next/link';
import BrandLogo from '@/components/BrandLogo';
import { useOverlay } from '@/components/overlays/OverlayContext';

export default function Footer() {
  const { openPanel } = useOverlay();

  return (
    <footer className="border-t border-[var(--cloud)] bg-[var(--surface)] px-4 py-12 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:justify-between">
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
              <li><Link href="/" className="text-[var(--text-secondary)] hover:text-[var(--teal)]">Home</Link></li>
              <li><Link href="/features" className="text-[var(--text-secondary)] hover:text-[var(--teal)]">Features</Link></li>
              <li><Link href="/dashboard" className="text-[var(--text-secondary)] hover:text-[var(--teal)]">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-label mb-3 text-[var(--text-secondary)]">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/login" className="text-[var(--text-secondary)] hover:text-[var(--teal)]">Sign in</Link></li>
              <li><Link href="/register" className="text-[var(--text-secondary)] hover:text-[var(--teal)]">Register</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-label mb-3 text-[var(--text-secondary)]">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button type="button" onClick={() => openPanel('contact')} className="text-[var(--text-secondary)] hover:text-[var(--teal)]">
                  Contact
                </button>
              </li>
              <li>
                <button type="button" onClick={() => openPanel('settings')} className="text-[var(--text-secondary)] hover:text-[var(--teal)]">
                  Settings
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-6xl text-center text-xs text-[var(--text-secondary)]">
        VidyarthiCompanion · Midnight Monsoon Design System · Built for Amazon Hackon
      </p>
    </footer>
  );
}
