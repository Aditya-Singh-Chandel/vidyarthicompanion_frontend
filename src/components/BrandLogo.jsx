import React from 'react';
import { Sparkles } from 'lucide-react';

const SIZES = {
  sm: { box: 'h-8 w-8', icon: 'h-4 w-4', name: 'text-base', tag: 'text-[10px]' },
  md: { box: 'h-10 w-10', icon: 'h-5 w-5', name: 'text-xl', tag: 'text-xs' },
  lg: { box: 'h-12 w-12', icon: 'h-6 w-6', name: 'text-2xl', tag: 'text-sm' },
};

export default function BrandLogo({ size = 'md', variant = 'dark', showTagline = false, className = '' }) {
  const s = SIZES[size] || SIZES.md;
  const onDark = variant === 'light';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`${s.box} relative flex shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--teal)] shadow-[var(--shadow-glow-teal)]`}
      >
        <Sparkles className={`${s.icon} text-white`} />
        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[var(--saffron)] shadow-[var(--shadow-glow-saffron)]" />
      </div>
      <div className="flex flex-col leading-none">
        <span
          className={`${s.name} font-black tracking-tight ${onDark ? 'text-[var(--text-on-dark)]' : 'text-[var(--ink)]'}`}
        >
          VidyarthiCompanion
        </span>
        {showTagline && (
          <span className={`${s.tag} mt-1 font-medium ${onDark ? 'text-[var(--text-muted-dark)]' : 'text-[var(--text-secondary)]'}`}>
            Midnight Monsoon OS
          </span>
        )}
      </div>
    </div>
  );
}
