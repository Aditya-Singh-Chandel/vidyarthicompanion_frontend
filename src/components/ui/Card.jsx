import React from 'react';

export default function Card({
  children,
  className = '',
  hover = true,
  padding = 'p-6',
  cutCorner = false,
  ...props
}) {
  return (
    <div
      className={`card-base ${padding} ${hover ? '' : 'hover:transform-none hover:shadow-[var(--shadow-float)]'} ${cutCorner ? 'card-cut-corner' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, badge, action, className = '' }) {
  return (
    <div className={`mb-4 flex items-start justify-between gap-3 ${className}`}>
      <div>
        {badge && (
          <span className="text-label mb-2 inline-block text-[var(--teal)]">{badge}</span>
        )}
        {title && <h3 className="text-title text-[var(--text-primary)]">{title}</h3>}
        {subtitle && <p className="mt-1 text-sm text-[var(--text-secondary)]">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
