'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, Wallet, Settings, LogOut, Compass, ChevronRight } from 'lucide-react';
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
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleSignOut = () => {
    logout();
    router.replace('/login');
  };

  const displayName = user?.username ? `@${user.username}` : user?.name || 'Student';
  const initial = (user?.username || user?.name || 'S').charAt(0).toUpperCase();
  const roleLabel = ROLE_LABELS[user?.role] || 'Student';

  return (
    <div className="relative z-50 flex h-screen w-64 flex-col sidebar-aurora">
      {/* Brand */}
      <div className="flex h-20 shrink-0 items-center gap-2.5 border-b border-white/30 px-6 relative overflow-hidden">
        {/* Subtle gradient glow behind brand */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand)]/5 via-transparent to-[var(--brand-2)]/5 pointer-events-none" />
        <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--brand)] to-[var(--brand-dark)] text-white shadow-[0_10px_24px_-6px_rgba(109,94,252,0.7)] transition-transform duration-300 hover:scale-110">
          <Compass className="h-5 w-5" />
        </span>
        <div className="relative leading-none">
          <h1 className="font-display text-xl font-semibold tracking-tight text-gray-900">
            Vidyarthi<span className="cf-gradient-text">Companion</span>
          </h1>
          <span className="text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-[var(--brand)]/60">
            AI OS
          </span>
        </div>
      </div>

      <nav className="flex flex-1 flex-col justify-between overflow-y-auto px-4 pb-6 pt-6">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const isHovered = hoveredItem === item.name;
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onMouseEnter={() => setHoveredItem(item.name)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`group relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-3 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'nav-item-active text-[var(--brand)]'
                      : 'text-gray-600 hover:bg-[var(--brand)]/5 hover:text-gray-900'
                  }`}
                >
                  {/* Active indicator bar with gradient */}
                  <span
                    className={`absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full nav-active-bar transition-all duration-300 ${
                      isActive ? 'opacity-100' : 'opacity-0 -translate-x-1'
                    }`}
                  />
                  <div className={`relative flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-[var(--brand)]/10'
                      : 'bg-transparent group-hover:bg-[var(--brand)]/5'
                  }`}>
                    <Icon
                      className={`h-[18px] w-[18px] shrink-0 transition-all duration-300 ${
                        isActive
                          ? 'text-[var(--brand)]'
                          : 'text-gray-400 group-hover:text-[var(--brand)]'
                      } ${isHovered ? 'scale-110' : ''}`}
                    />
                  </div>
                  <span className="flex-1">{item.name}</span>
                  <ChevronRight
                    className={`h-4 w-4 text-gray-300 transition-all duration-300 ${
                      isActive || isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                    }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        {/* User Profile Section */}
        <div className="mt-auto pt-6">
          <button
            onClick={handleSignOut}
            className="group mb-3 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-600 transition-all hover:bg-rose-50 hover:text-rose-700"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors group-hover:bg-rose-100">
              <LogOut className="h-[18px] w-[18px] shrink-0 text-gray-400 transition-colors group-hover:text-rose-600" />
            </div>
            Sign Out
          </button>

          <Link
            href="/profile"
            title="Open your profile"
            className={`group flex items-center gap-3 rounded-xl p-3 transition-all duration-300 hover:-translate-y-0.5 ${
              pathname === '/profile'
                ? 'nav-item-active ring-1 ring-inset ring-[var(--brand)]/15'
                : 'bg-white/50 ring-1 ring-inset ring-gray-200/50 hover:bg-white/70 hover:ring-[var(--brand)]/20'
            }`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--brand)] to-[var(--brand-2)] font-display font-bold text-white shadow-[0_10px_22px_-6px_rgba(109,94,252,0.6)] transition-transform duration-300 group-hover:scale-105">
              {initial}
            </div>
            <div className="flex flex-col truncate">
              <span className="truncate text-sm font-bold text-gray-900">{displayName}</span>
              <span className="truncate text-xs text-[var(--brand)]/60">{roleLabel}</span>
            </div>
          </Link>
        </div>
      </nav>
    </div>
  );
}
