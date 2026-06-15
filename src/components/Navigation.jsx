'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, Wallet, Settings, LogOut, Compass } from 'lucide-react';
import { useAuth } from '@/features/authEngine/AuthContext';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Community', href: '/community', icon: Users },
  { name: 'PocketBuddy', href: '/wallet', icon: Wallet },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const ROLE_LABELS = {
  student: 'Student',
  cr: 'Class Representative',
  admin: 'Administrator',
};

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleSignOut = () => {
    logout();
    router.replace('/login');
  };

  const displayName = user?.username ? `@${user.username}` : user?.name || 'Student';
  const initial = (user?.username || user?.name || 'S').charAt(0).toUpperCase();
  const roleLabel = ROLE_LABELS[user?.role] || 'Student';

  return (
    <div className="relative z-50 flex h-screen w-64 flex-col border-r border-white/60 bg-white/55 shadow-[0_0_50px_-20px_rgba(109,94,252,0.5)] backdrop-blur-2xl">
      {/* Brand */}
      <div className="flex h-20 shrink-0 items-center gap-2.5 border-b border-white/50 px-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-[0_10px_24px_-6px_rgba(109,94,252,0.8)]">
          <Compass className="h-5 w-5" />
        </span>
        <div className="leading-none">
          <h1 className="font-display text-xl font-semibold tracking-tight text-gray-900">
            CampusFlow
          </h1>
          <span className="text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-gray-400">
            AI OS
          </span>
        </div>
      </div>

      <nav className="flex flex-1 flex-col justify-between overflow-y-auto px-4 pb-6 pt-6">
        <ul className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`group relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-3 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-inset ring-indigo-100'
                      : 'text-gray-600 hover:translate-x-0.5 hover:bg-gray-100/70 hover:text-gray-900'
                  }`}
                >
                  {/* animated active indicator */}
                  <span
                    className={`absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-indigo-600 transition-all duration-300 ${
                      isActive ? 'opacity-100' : 'opacity-0 -translate-x-1'
                    }`}
                  />
                  <Icon
                    className={`h-5 w-5 shrink-0 transition-all duration-300 group-hover:scale-110 ${
                      isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-700'
                    }`}
                  />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* User Profile Section */}
        <div className="mt-auto pt-6">
          <button
            onClick={handleSignOut}
            className="group mb-2 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-600 transition-all hover:bg-rose-50 hover:text-rose-700"
          >
            <LogOut className="h-5 w-5 shrink-0 text-gray-400 transition-colors group-hover:text-rose-600" />
            Sign Out
          </button>

          <Link
            href="/profile"
            title="Open your profile"
            className={`flex items-center gap-3 rounded-xl p-3 ring-1 ring-inset transition-all hover:-translate-y-0.5 ${
              pathname === '/profile'
                ? 'bg-indigo-50 ring-indigo-100'
                : 'bg-gray-100/70 ring-gray-200 hover:bg-gray-100'
            }`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 font-display font-bold text-white shadow-[0_10px_22px_-6px_rgba(109,94,252,0.8)]">
              {initial}
            </div>
            <div className="flex flex-col truncate">
              <span className="truncate text-sm font-bold text-gray-900">{displayName}</span>
              <span className="truncate text-xs text-gray-500">{roleLabel}</span>
            </div>
          </Link>
        </div>
      </nav>
    </div>
  );
}
