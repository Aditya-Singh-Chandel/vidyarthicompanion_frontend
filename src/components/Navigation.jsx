'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, Wallet, UserCog, LogOut } from 'lucide-react';
import { useAuth } from '@/features/authEngine/AuthContext';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Community', href: '/community', icon: Users },
  { name: 'PocketBuddy', href: '/wallet', icon: Wallet },
  { name: 'Profile', href: '/profile', icon: UserCog },
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

  const displayName = user?.name || 'Student';
  const initial = displayName.charAt(0).toUpperCase();
  const roleLabel = ROLE_LABELS[user?.role] || 'Student';

  return (
    <div className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white shadow-sm z-50 relative">
      <div className="flex h-20 shrink-0 items-center px-6 border-b border-gray-100">
        <h1 className="text-2xl font-black tracking-tighter text-indigo-600">
          CampusFlow.
        </h1>
      </div>
      
      <nav className="flex flex-1 flex-col justify-between px-4 pb-6 pt-6 overflow-y-auto">
        <ul className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-inset ring-indigo-100'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 shrink-0 transition-colors ${
                      isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'
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
            className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-700 transition-all mb-2"
          >
            <LogOut className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-red-600 transition-colors" />
            Sign Out
          </button>

          <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 ring-1 ring-inset ring-gray-200">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white font-bold shadow-sm">
              {initial}
            </div>
            <div className="flex flex-col truncate">
              <span className="text-sm font-bold text-gray-900 truncate">{displayName}</span>
              <span className="text-xs text-gray-500 truncate">{roleLabel}</span>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}