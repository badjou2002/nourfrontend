import React, { useState, useEffect } from 'react';
import { formatTND } from '../../utils/format';

export default function PriceRangeSlider({ min, max, value, onChange, step = 1 }) {
  const [local, setLocal] = useState(value);

  useEffect(() => setLocal(value), [value]);

  const safeMax = max > min ? max : min + 1;
  const safeMin = min;

  const low = Math.max(safeMin, Math.min(local[0], safeMax));
  const high = Math.min(safeMax, Math.max(local[1], safeMin));

  const lowPercent = ((low - safeMin) / (safeMax - safeMin)) * 100;
  const highPercent = ((high - safeMin) / (safeMax - safeMin)) * 100;

  const commitLow = (v) => {
    const nextLow = Math.min(Number(v), high - step);
    setLocal([nextLow, high]);
    onChange([nextLow, high]);
  };

  const commitHigh = (v) => {
    const nextHigh = Math.max(Number(v), low + step);
    setLocal([low, nextHigh]);
    onChange([low, nextHigh]);
  };

  return (
    <div>
      <div className="relative">
        <div className="price-range-track" />
        <div
          className="price-range-fill"
          style={{ left: `${lowPercent}%`, width: `${highPercent - lowPercent}%` }}
        />
        <input
          type="range"
          min={safeMin}
          max={safeMax}
          step={step}
          value={low}
          onChange={(e) => commitLow(e.target.value)}
          aria-label="Prix minimum"
          className="price-range-input"
        />
        <input
          type="range"
          min={safeMin}
          max={safeMax}
          step={step}
          value={high}
          onChange={(e) => commitHigh(e.target.value)}
          aria-label="Prix maximum"
          className="price-range-input"
        />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="chip bg-nour-lavender-pale text-nour-lavender-dark">{formatTND(low)}</span>
        <span className="text-xs text-nour-ink/40">à</span>
        <span className="chip bg-nour-teal-light text-nour-teal-dark">{formatTND(high)}</span>
      </div>
    </div>
  );
}
