import React from 'react';

const VARIANTS = {
  teal: 'bg-teal-50 text-[var(--teal)] border-teal-200',
  saffron: 'bg-amber-50 text-[var(--saffron)] border-amber-200',
  ink: 'bg-slate-100 text-[var(--ink)] border-slate-200',
  success: 'bg-emerald-50 text-[var(--success)] border-emerald-200',
};

export default function Badge({ children, variant = 'teal', className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-[var(--radius-pill)] border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
