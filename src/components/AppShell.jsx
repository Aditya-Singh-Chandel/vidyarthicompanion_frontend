'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/features/authEngine/AuthContext';
import Navigation from './Navigation';

// Routes reachable without authentication.
const PUBLIC_ROUTES = ['/login', '/register', '/', '/features'];

function FullScreenLoader() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-indigo-100 border-t-indigo-600" />
          <div className="absolute inset-2 rounded-full bg-indigo-600/10 cf-float" />
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
 * - authenticated routes render the sidebar + content
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
    return <div className={`h-screen w-full overflow-y-auto ${isAuthPage ? 'bg-gray-50' : ''}`}>{children}</div>;
  }

  // Awaiting redirect for unauthenticated access to a protected route.
  if (!user) return <FullScreenLoader />;

  return (
    <>
      <Navigation />
      <main key={pathname} className="cf-page-enter relative flex-1 overflow-y-auto">{children}</main>
    </>
  );
}
