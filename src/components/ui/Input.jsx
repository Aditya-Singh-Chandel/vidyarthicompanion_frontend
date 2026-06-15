import React from 'react';

export default function Input({ label, error, className = '', id, ...props }) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-[var(--text-primary)]">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className="w-full rounded-[var(--radius-lg)] border border-[var(--cloud)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] transition-all duration-200 placeholder:text-[var(--text-secondary)] focus:border-[var(--teal)] focus:outline-none focus:ring-2 focus:ring-[var(--teal-glow)]"
        {...props}
      />
      {error && <p className="mt-1 text-xs text-[var(--danger)]">{error}</p>}
    </div>
  );
}

export function Textarea({ label, error, className = '', id, rows = 4, ...props }) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-[var(--text-primary)]">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        rows={rows}
        className="w-full resize-none rounded-[var(--radius-lg)] border border-[var(--cloud)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] transition-all duration-200 placeholder:text-[var(--text-secondary)] focus:border-[var(--teal)] focus:outline-none focus:ring-2 focus:ring-[var(--teal-glow)]"
        {...props}
      />
      {error && <p className="mt-1 text-xs text-[var(--danger)]">{error}</p>}
    </div>
  );
}
