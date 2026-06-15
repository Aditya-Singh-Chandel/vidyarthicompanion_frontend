import React from 'react';

export default function ProgressBar({ value = 0, max = 100, label, showValue = true, variant = 'teal', className = '' }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const barColor = variant === 'saffron' ? 'bg-[var(--saffron)]' : 'bg-[var(--teal)]';

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="mb-2 flex items-center justify-between text-sm">
          {label && <span className="font-medium text-[var(--text-primary)]">{label}</span>}
          {showValue && (
            <span className="text-mono-data text-xs font-bold text-[var(--text-secondary)]">
              {Math.round(pct)}%
            </span>
          )}
        </div>
      )}
      <div className="h-2 overflow-hidden rounded-[var(--radius-pill)] bg-[var(--cloud)]">
        <div
          className={`h-full rounded-[var(--radius-pill)] transition-all duration-700 ease-out ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
