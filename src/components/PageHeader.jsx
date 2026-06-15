import React from 'react';

export default function PageHeader({ title, description, badge, children }) {
  return (
    <header className="mb-8 animate-fade-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {badge && (
            <span className="mb-2 inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-orange-700">
              {badge}
            </span>
          )}
          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
          {description && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">{description}</p>}
        </div>
        {children && <div className="shrink-0">{children}</div>}
      </div>
    </header>
  );
}
