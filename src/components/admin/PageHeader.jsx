import React from 'react';

export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-bold text-nour-ink sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-nour-ink/60">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
