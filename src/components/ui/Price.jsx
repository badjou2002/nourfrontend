import React from 'react';
import { formatTND } from '../../utils/format';

export default function Price({ price, compareAtPrice, className = '' }) {
  const hasDiscount = compareAtPrice && compareAtPrice > price;
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="font-display text-lg font-semibold text-nour-lavender-dark">{formatTND(price)}</span>
      {hasDiscount && (
        <span className="text-sm text-nour-ink/40 line-through">{formatTND(compareAtPrice)}</span>
      )}
    </div>
  );
}
