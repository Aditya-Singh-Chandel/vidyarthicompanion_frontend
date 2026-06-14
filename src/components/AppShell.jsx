'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/features/authEngine/AuthContext';
import Navigation from './Navigation';

// Routes reachable without authentication.
const PUBLIC_ROUTES = ['/login', '/register'];

function FullScreenLoader() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
        <p className="text-sm font-medium text-gray-500">Loading CampusFlow…</p>
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
    } else if (user && isPublic) {
      router.replace('/dashboard');
    }
  }, [loading, user, isPublic, router]);

  if (loading) return <FullScreenLoader />;

  // Public pages (login/register): render without the app chrome.
  if (isPublic) {
    return <div className="h-screen w-full overflow-y-auto bg-gray-50">{children}</div>;
  }

  // Awaiting redirect for unauthenticated access to a protected route.
  if (!user) return <FullScreenLoader />;

  return (
    <>
      <Navigation />
      <main className="flex-1 overflow-y-auto relative">{children}</main>
    </>
  );
}
