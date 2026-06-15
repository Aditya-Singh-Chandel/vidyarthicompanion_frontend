'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function OverlayPanel({ open, onClose, title, subtitle, children, width = 'max-w-md' }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <button
        type="button"
        aria-label="Close panel"
        className="overlay-backdrop absolute inset-0"
        onClick={onClose}
      />
      <aside
        className={`animate-slide-right relative flex h-full w-full ${width} flex-col bg-[var(--surface)] shadow-[var(--shadow-lift)]`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="overlay-title"
      >
        <header className="flex shrink-0 items-start justify-between border-b border-[var(--cloud)] px-6 py-5">
          <div>
            <h2 id="overlay-title" className="text-title text-[var(--text-primary)]">
              {title}
            </h2>
            {subtitle && <p className="mt-1 text-sm text-[var(--text-secondary)]">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[var(--radius-md)] p-2 text-[var(--text-secondary)] transition-colors hover:bg-[var(--cloud)] hover:text-[var(--text-primary)]"
          >
            <X className="h-5 w-5" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
      </aside>
    </div>
  );
}
