'use client';

import React from 'react';

export default function Toggle({ checked, onChange, label, description, disabled = false }) {
  return (
    <label className={`flex cursor-pointer items-center justify-between gap-4 ${disabled ? 'opacity-50' : ''}`}>
      <div className="min-w-0">
        {label && <span className="block text-sm font-semibold text-[var(--text-primary)]">{label}</span>}
        {description && <span className="mt-0.5 block text-xs text-[var(--text-secondary)]">{description}</span>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-[var(--radius-pill)] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--teal)] focus-visible:ring-offset-2 ${
          checked ? 'bg-[var(--teal)]' : 'bg-[var(--cloud)]'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-300 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </label>
  );
}
