'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary:
    'bg-gradient-to-r from-[var(--brand)] to-[var(--brand-dark)] text-white hover:from-[var(--brand-light)] hover:to-[var(--brand)] shadow-[0_10px_30px_-8px_rgba(109,94,252,0.6)] hover:shadow-[0_16px_40px_-8px_rgba(109,94,252,0.8)] focus-visible:ring-[var(--brand)]',
  secondary:
    'bg-[var(--ink-soft)] text-[var(--text-on-dark)] hover:bg-[var(--ink-muted)] focus-visible:ring-[var(--ink-soft)]',
  accent:
    'bg-gradient-to-r from-[var(--brand-2)] to-[var(--brand-4)] text-white hover:from-[var(--brand-4)] hover:to-[var(--brand-2)] shadow-[0_10px_30px_-8px_rgba(155,92,255,0.5)] focus-visible:ring-[var(--brand-2)]',
  ghost:
    'bg-transparent text-[var(--text-primary)] hover:bg-[var(--cloud)] focus-visible:ring-[var(--brand)]',
  outline:
    'bg-transparent border-2 border-[var(--brand)] text-[var(--brand)] hover:bg-[var(--brand)] hover:text-white focus-visible:ring-[var(--brand)]',
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
