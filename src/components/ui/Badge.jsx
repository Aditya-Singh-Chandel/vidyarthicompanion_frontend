import React from 'react';

const VARIANTS = {
  teal: 'bg-[var(--brand-3)]/10 text-[var(--brand-3)] border-[var(--brand-3)]/20',
  saffron: 'bg-[var(--brand-2)]/10 text-[var(--brand-2)] border-[var(--brand-2)]/20',
  ink: 'bg-slate-100 text-[var(--ink)] border-slate-200',
  success: 'bg-emerald-50 text-[var(--success)] border-emerald-200',
  brand: 'bg-[var(--brand)]/10 text-[var(--brand)] border-[var(--brand)]/20',
  aurora: 'bg-gradient-to-r from-[var(--brand)]/10 to-[var(--brand-2)]/10 text-[var(--brand)] border-[var(--brand)]/20',
};

export default function Badge({ children, variant = 'teal', className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-[var(--radius-pill)] border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${VARIANTS[variant] || VARIANTS.brand} ${className}`}
    >
      {children}
    </span>
  );
}
