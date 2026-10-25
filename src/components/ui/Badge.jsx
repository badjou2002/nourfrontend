import React from 'react';

const tones = {
  lavender: 'bg-nour-lavender-pale text-nour-lavender-dark',
  teal: 'bg-nour-teal-light text-nour-teal-dark',
  terracotta: 'bg-nour-terracotta-light text-nour-terracotta',
  blush: 'bg-nour-blush-light text-nour-terracotta',
  sage: 'bg-nour-sage-light text-nour-teal-dark',
};

export default function Badge({ tone = 'lavender', children, className = '', ...props }) {
  return (
    <span className={`chip ${tones[tone] || tones.lavender} ${className}`} {...props}>
      {children}
    </span>
  );
}
