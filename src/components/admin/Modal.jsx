import React from 'react';
import { FiX } from 'react-icons/fi';

const sizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-3xl',
  xl: 'max-w-5xl',
};

export default function Modal({ open, onClose, title, children, footer, size = 'md' }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-nour-ink/40" onClick={onClose} />
      <div
        className={`relative flex max-h-[90vh] w-full ${sizes[size] || sizes.md} animate-fade-up flex-col overflow-hidden rounded-squishy bg-white shadow-doodle-lg`}
      >
        <header className="flex items-center justify-between border-b-2 border-nour-lavender-light/60 px-6 py-4">
          <h3 className="font-display text-xl font-semibold text-nour-ink">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="flex h-9 w-9 items-center justify-center rounded-full text-nour-ink/60 transition-colors hover:bg-nour-lavender-pale"
          >
            <FiX size={20} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <footer className="flex justify-end gap-3 border-t-2 border-nour-lavender-light/60 px-6 py-4">{footer}</footer>}
      </div>
    </div>
  );
}
