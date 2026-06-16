'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/features/authEngine/AuthContext';
import Navigation from './Navigation';
import AuroraBackground from './AuroraBackground';

// Routes reachable without authentication.
const PUBLIC_ROUTES = ['/login', '/register', '/', '/features'];

function FullScreenLoader() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[var(--mist)]">
      {/* Aurora backdrop for loader */}
      <div className="cf-aurora">
        <div className="cf-blob cf-blob-1" />
        <div className="cf-blob cf-blob-2" />
        <div className="cf-blob cf-blob-3" />
        <div className="cf-blob cf-blob-4" />
      </div>
      <div className="relative flex flex-col items-center gap-4">
        <div className="relative h-14 w-14">
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-[var(--brand)]/20 border-t-[var(--brand)]" style={{ animationDuration: '1.2s' }} />
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-[var(--brand)]/15 to-[var(--brand-2)]/15 cf-float" />
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[var(--brand)]/10 to-[var(--brand-3)]/10 cf-float" style={{ animationDelay: '0.5s' }} />
        </div>
        <p className="font-display text-base font-medium tracking-tight text-gray-600">
          Loading VidyarthiCompanion&hellip;
        </p>
      </div>
    </div>
  );
}

/**
 * Client shell that gates the app behind auth and chooses the layout:
 * - public routes render bare (no sidebar)
 * - authenticated routes render the sidebar + content with aurora backdrop
 */
export default function AppShell({ children }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isPublic = PUBLIC_ROUTES.includes(pathname);

  useEffect(() => {
    if (loading) return;
    if (!user && !isPublic) {
      router.replace('/login');
    } else if (user && (pathname === '/login' || pathname === '/register')) {
      router.replace('/dashboard');
    }
  }, [loading, user, isPublic, pathname, router]);

  if (loading) return <FullScreenLoader />;

  // Public pages (login/register/landing): render without the app chrome.
  if (isPublic) {
    const isAuthPage = pathname === '/login' || pathname === '/register';
    return <div className={`h-screen w-full overflow-y-auto ${isAuthPage ? 'bg-[var(--mist)]' : ''}`}>{children}</div>;
  }

  // Awaiting redirect for unauthenticated access to a protected route.
  if (!user) return <FullScreenLoader />;

  return (
    <>
      {/* Aurora backdrop for authenticated pages */}
      <AuroraBackground />
      <Navigation />
      <main key={pathname} className="cf-page-enter relative flex-1 overflow-y-auto">
        {children}
      </main>
    </>
  );
}
