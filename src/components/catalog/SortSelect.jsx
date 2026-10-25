import React from 'react';
import { FiArrowDown } from 'react-icons/fi';

const OPTIONS = [
  { value: 'newest', label: 'Nouveautés' },
  { value: 'popular', label: 'Popularité' },
  { value: 'price_asc', label: 'Prix croissant' },
  { value: 'price_desc', label: 'Prix décroissant' },
  { value: 'rating', label: 'Meilleures notes' },
];

export default function SortSelect({ value, onChange }) {
  return (
    <div className="relative">
      <FiArrowDown className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-nour-lavender" size={16} />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Trier les produits"
        className="input-nour cursor-pointer appearance-none rounded-full py-2.5 pl-10 pr-10"
      >
        {OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-nour-ink/40">▼</span>
    </div>
  );
}
