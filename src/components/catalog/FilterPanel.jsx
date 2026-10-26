import React from 'react';
import { FiChevronDown } from 'react-icons/fi';
import PriceRangeSlider from './PriceRangeSlider';

function CheckboxGroup({ title, options, selected, onToggle }) {
  if (!options || !options.length) return null;
  return (
    <div className="border-t-2 border-nour-lavender-light/60 pt-4">
      <h4 className="font-display text-sm font-semibold text-nour-ink">{title}</h4>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => {
          const label = typeof option === 'string' ? option : option.name;
          const isSelected = selected.includes(label);
          return (
            <button
              key={label}
              onClick={() => onToggle(label)}
              className={`rounded-full border-2 px-3.5 py-1.5 text-xs font-medium transition-all ${
                isSelected
                  ? 'border-nour-lavender bg-nour-lavender-pale text-nour-lavender-dark'
                  : 'border-nour-lavender-light text-nour-ink/60 hover:border-nour-lavender'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function FilterPanel({
  options,
  filters,
  onToggle,
  onPriceChange,
  onAvailability,
  onReset,
  activeCount,
  className = 'card-nour sticky top-24 flex flex-col gap-4 p-5',
}) {
  const availabilityOptions = [
    { value: 'in_stock', label: 'En stock' },
    { value: 'preorder', label: 'Précommande' },
  ];

  return (
    <aside className={className}>
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">Filtres</h3>
        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="text-xs font-medium text-nour-terracotta hover:underline"
          >
            Réinitialiser ({activeCount})
          </button>
        )}
      </div>

      <div>
        <h4 className="font-display text-sm font-semibold text-nour-ink">Catégories</h4>
        <ul className="mt-3 space-y-1.5">
          {options.categories.map((category) => {
            const isSelected = filters.category.includes(category.slug);
            return (
              <li key={category._id}>
                <button
                  onClick={() => onToggle('category', category.slug)}
                  className={`flex w-full items-center gap-3 rounded-soft px-3 py-2 text-left text-sm transition-colors ${
                    isSelected ? 'bg-nour-lavender-pale font-medium text-nour-lavender-dark' : 'text-nour-ink/70 hover:bg-nour-lavender-pale/50'
                  }`}
                >
                  {category.imageCloudinaryUrl && (
                    <img src={category.imageCloudinaryUrl} alt="" className="h-7 w-7 rounded-full object-cover" />
                  )}
                  <span className="flex-1">{category.name}</span>
                  <FiChevronDown className={`transition-transform ${isSelected ? 'rotate-180' : ''} text-xs opacity-50`} />
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="border-t-2 border-nour-lavender-light/60 pt-4">
        <h4 className="font-display text-sm font-semibold text-nour-ink">Prix (TND)</h4>
        <div className="mt-4">
          <PriceRangeSlider
            min={options.minPrice}
            max={options.maxPrice}
            value={[filters.minPrice || options.minPrice, filters.maxPrice || options.maxPrice]}
            onChange={onPriceChange}
          />
        </div>
      </div>

      <CheckboxGroup
        title="Formats"
        options={options.formats}
        selected={filters.formats}
        onToggle={(value) => onToggle('formats', value)}
      />

      <CheckboxGroup
        title="Reliure"
        options={options.bindings}
        selected={filters.bindings}
        onToggle={(value) => onToggle('bindings', value)}
      />

      <CheckboxGroup
        title="Couleurs"
        options={options.colors}
        selected={filters.colors}
        onToggle={(value) => onToggle('colors', value)}
      />

      <div className="border-t-2 border-nour-lavender-light/60 pt-4">
        <h4 className="font-display text-sm font-semibold text-nour-ink">Disponibilité</h4>
        <div className="mt-3 flex flex-col gap-2">
          {availabilityOptions.map((option) => {
            const isSelected = filters.availability === option.value;
            return (
              <label key={option.value} className="flex cursor-pointer items-center gap-2.5 text-sm text-nour-ink/70">
                <input
                  type="radio"
                  name="availability"
                  checked={isSelected}
                  onChange={() => onAvailability(isSelected ? '' : option.value)}
                  className="h-4 w-4 accent-nour-lavender"
                />
                {option.label}
              </label>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
