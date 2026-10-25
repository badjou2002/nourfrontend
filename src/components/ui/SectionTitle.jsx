import React from 'react';

export default function SectionTitle({ label, title, subtitle, align = 'center', className = '' }) {
  const alignClass = align === 'left' ? 'text-left' : 'text-center';
  return (
    <div className={`${alignClass} ${className || 'mb-10'}`}>
      {label && (
        <p className="section-label mb-2 text-nour-teal">
          <span className="mr-2 inline-block h-2 w-2 animate-wiggle rounded-full bg-nour-lavender" />
          {label}
        </p>
      )}
      <h2 className="font-display text-3xl font-semibold sm:text-4xl">{title}</h2>
      {subtitle && <p className="mx-auto mt-3 max-w-xl text-nour-ink/60 sm:text-lg">{subtitle}</p>}
    </div>
  );
}
