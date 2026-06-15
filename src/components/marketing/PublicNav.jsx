'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Settings, Mail } from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';
import Button from '@/components/ui/Button';
import { useOverlay } from '@/components/overlays/OverlayContext';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/features', label: 'Features' },
  { href: '/dashboard', label: 'Dashboard' },
];

export default function PublicNav() {
  const pathname = usePathname();
  const { openPanel } = useOverlay();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`nav-sticky fixed top-0 left-0 right-0 z-50 px-4 py-3 sm:px-6 ${scrolled ? 'scrolled' : 'bg-transparent'}`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="transition-opacity hover:opacity-80">
          <BrandLogo size="sm" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-[var(--radius-pill)] px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  active
                    ? 'bg-[var(--teal)] text-white shadow-[var(--shadow-glow-teal)]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--cloud)] hover:text-[var(--text-primary)]'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={() => openPanel('contact')}
            className="rounded-[var(--radius-lg)] p-2 text-[var(--text-secondary)] transition-colors hover:bg-[var(--cloud)] hover:text-[var(--teal)]"
            aria-label="Contact"
          >
            <Mail className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => openPanel('settings')}
            className="rounded-[var(--radius-lg)] p-2 text-[var(--text-secondary)] transition-colors hover:bg-[var(--cloud)] hover:text-[var(--teal)]"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </button>
          <Link href="/login">
            <Button variant="primary" size="pill">
              Sign in
            </Button>
          </Link>
        </div>

        <button
          type="button"
          className="rounded-[var(--radius-lg)] p-2 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {mobileOpen && (
        <div className="glass-surface mx-4 mt-2 rounded-[var(--radius-xl)] p-4 md:hidden animate-fade-in">
          {LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="block rounded-[var(--radius-lg)] px-3 py-2.5 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--mist)]"
            >
              {label}
            </Link>
          ))}
          <div className="mt-2 flex gap-2 border-t border-[var(--cloud)] pt-3">
            <Button variant="ghost" size="sm" onClick={() => { openPanel('contact'); setMobileOpen(false); }}>
              Contact
            </Button>
            <Link href="/login" className="flex-1">
              <Button variant="primary" size="sm" className="w-full">Sign in</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
