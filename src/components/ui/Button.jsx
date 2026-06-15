'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary:
    'bg-[var(--teal)] text-white hover:bg-[var(--teal-bright)] shadow-[var(--shadow-glow-teal)] focus-visible:ring-[var(--teal)]',
  secondary:
    'bg-[var(--ink-soft)] text-[var(--text-on-dark)] hover:bg-[var(--ink-muted)] focus-visible:ring-[var(--ink-soft)]',
  accent:
    'bg-[var(--saffron)] text-[var(--ink)] hover:bg-[var(--saffron-bright)] shadow-[var(--shadow-glow-saffron)] focus-visible:ring-[var(--saffron)]',
  ghost:
    'bg-transparent text-[var(--text-primary)] hover:bg-[var(--cloud)] focus-visible:ring-[var(--teal)]',
  outline:
    'bg-transparent border-2 border-[var(--teal)] text-[var(--teal)] hover:bg-[var(--teal)] hover:text-white focus-visible:ring-[var(--teal)]',
  danger:
    'bg-[var(--danger)] text-white hover:opacity-90 focus-visible:ring-[var(--danger)]',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-[var(--radius-md)]',
  md: 'px-5 py-2.5 text-sm gap-2 rounded-[var(--radius-lg)]',
  lg: 'px-6 py-3 text-base gap-2.5 rounded-[var(--radius-xl)]',
  pill: 'px-6 py-2.5 text-sm gap-2 rounded-[var(--radius-pill)]',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  icon: Icon,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98] ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : Icon && <Icon className="h-4 w-4" />}
      {children}
    </button>
  );
}
