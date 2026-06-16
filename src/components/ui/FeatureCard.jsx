'use client';

import React, { useState, useRef, useCallback } from 'react';
import { ArrowRight, X } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  badge,
  span = 'normal',
  accent = 'teal',
  details,
}) {
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef(null);
  const [glow, setGlow] = useState({ x: 50, y: 50 });

  const accentColor = accent === 'saffron' ? 'var(--brand-2)' : 'var(--brand)';
  const spanClass =
    span === 'tall' ? 'md:row-span-2' : span === 'wide' ? 'md:col-span-2' : '';

  const handleMouseMove = useCallback((e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setGlow({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      style={{
        background: `radial-gradient(circle 250px at ${glow.x}% ${glow.y}%, rgba(109, 94, 252, 0.06), transparent 70%)`,
      }}
      className="rounded-[var(--radius-2xl)]"
    >
      <Card
        className={`group relative overflow-hidden ${spanClass} ${expanded ? 'ring-2 ring-[var(--brand)]' : ''}`}
        hover={!expanded}
        cutCorner={accent === 'saffron'}
      >
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-150"
          style={{ background: `radial-gradient(circle, ${accentColor}22 0%, transparent 70%)` }}
        />

        <div className="relative">
          <div className="mb-4 flex items-start justify-between">
            <span
              className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-lg)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
              style={{ background: `${accentColor}15`, color: accentColor }}
            >
              <Icon className="h-5 w-5" />
            </span>
            {badge && <Badge variant={accent === 'saffron' ? 'saffron' : 'brand'}>{badge}</Badge>}
          </div>

          <h3 className="text-title text-[var(--text-primary)]">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{description}</p>

          <div
            className={`overflow-hidden transition-all duration-500 ease-out ${
              expanded ? 'mt-4 max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            {details && (
              <div className="rounded-[var(--radius-lg)] bg-gradient-to-br from-[var(--brand)]/5 to-[var(--brand-2)]/5 p-4 text-sm text-[var(--text-primary)] ring-1 ring-inset ring-[var(--brand)]/10">
                {details}
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Button
              variant={expanded ? 'ghost' : 'outline'}
              size="sm"
              onClick={() => setExpanded(!expanded)}
              icon={expanded ? X : ArrowRight}
            >
              {expanded ? 'Collapse' : 'Explore'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
