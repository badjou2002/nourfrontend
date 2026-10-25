import React from 'react';
import { elementUrl } from '../../assets/elements';

const doodleColors = [
  { color: '#a09ece', opacity: 0.35 },
  { color: '#3fa0a4', opacity: 0.28 },
  { color: '#80a7d9', opacity: 0.4 },
  { color: '#c85347', opacity: 0.22 },
];

const Doodle = ({ type = 'sparkle', color = '#a09ece', opacity = 0.35, size = 28, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={{ opacity }}>
    {type === 'sparkle' && (
      <path
        d="M12 2c.6 5.2 4.8 9.4 10 10-5.2.6-9.4 4.8-10 10-.6-5.2-4.8-9.4-10-10 5.2-.6 9.4-4.8 10-10Z"
        fill={color}
      />
    )}
    {type === 'heart' && (
      <path
        d="M12 21C7 16.5 3 13.2 3 9.6 3 7 5 5 7.4 5c1.6 0 3.1.9 4.6 2.6C13.5 5.9 15 5 16.6 5 19 5 21 7 21 9.6c0 3.6-4 6.9-9 11.4Z"
        fill={color}
      />
    )}
    {type === 'circle' && <circle cx="12" cy="12" r="10" fill={color} />}
    {type === 'plus' && (
      <path d="M12 2v20M2 12h20" stroke={color} strokeWidth="3" strokeLinecap="round" />
    )}
    {type === 'squiggle' && (
      <path
        d="M2 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    )}
    {type === 'star' && (
      <path
        d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2Z"
        fill={color}
      />
    )}
  </svg>
);

export function ElementArt({ n = 1, size = 44, opacity = 0.5, rotate = 0, className = '', style = {} }) {
  const src = elementUrl(n);
  if (!src) return null;
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      className={className}
      style={{
        width: size,
        height: 'auto',
        opacity,
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
        ...style,
      }}
    />
  );
}

export default function Doodles({ items = [], className = '' }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {items.map((doodle, index) => {
        const fallback = doodleColors[index % doodleColors.length];
        const isElement = doodle.el != null || doodle.element != null;
        return (
          <div
            key={index}
            className={`absolute ${doodle.animation === false ? '' : 'animate-float-slow'}`}
            style={{
              top: doodle.top,
              left: doodle.left,
              right: doodle.right,
              bottom: doodle.bottom,
              zIndex: doodle.z,
            }}
          >
            {isElement ? (
              <ElementArt
                n={doodle.el ?? doodle.element}
                size={doodle.size || 44}
                opacity={doodle.opacity ?? 0.5}
                rotate={doodle.rotate || 0}
              />
            ) : (
              <Doodle
                type={doodle.type}
                color={doodle.color || fallback.color}
                opacity={doodle.opacity ?? fallback.opacity}
                size={doodle.size || 28}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
