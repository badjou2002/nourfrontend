import React, { useRef } from 'react';
import { FiPlus, FiX, FiImage } from 'react-icons/fi';

export function MultipleImageUploader({ existing = [], files = [], onExistingRemove, onFilesChange, limit = 10 }) {
  const inputRef = useRef(null);
  const available = limit - existing.length - files.length;

  const handleSelect = (e) => {
    const selected = Array.from(e.target.files || []);
    const merged = [...files, ...selected].slice(0, limit);
    onFilesChange(merged);
    e.target.value = '';
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {existing.map((img) => (
          <div key={img.public_id || img.url} className="group relative aspect-square overflow-hidden rounded-soft border-2 border-nour-lavender-light">
            <img src={img.url} alt={img.alt || ''} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onExistingRemove(img.public_id)}
              aria-label="Retirer cette image"
              className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-nour-terracotta text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <FiX size={16} />
            </button>
          </div>
        ))}

        {files.map((file, index) => (
          <div key={`${file.name}-${index}`} className="group relative aspect-square overflow-hidden rounded-soft border-2 border-nour-teal">
            <img src={URL.createObjectURL(file)} alt={file.name} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onFilesChange(files.filter((_, i) => i !== index))}
              aria-label="Retirer cette image"
              className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-nour-terracotta text-white"
            >
              <FiX size={16} />
            </button>
          </div>
        ))}

        {available > 0 && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex aspect-square flex-col items-center justify-center gap-2 rounded-soft border-2 border-dashed border-nour-lavender/50 text-nour-lavender-dark transition-colors hover:border-nour-lavender hover:bg-nour-lavender-pale"
          >
            <FiImage size={24} />
            <span className="text-xs font-medium">Ajouter</span>
          </button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={handleSelect} />
      <p className="mt-2 text-xs text-nour-ink/50">
        {existing.length + files.length} / {limit} image(s) · JPG, PNG, WEBP (max 8 Mo)
      </p>
    </div>
  );
}

export function SingleImageUploader({ existingUrl, file, onFileChange, onRemoveExisting }) {
  const inputRef = useRef(null);

  return (
    <div>
      {(file || existingUrl) && (
        <div className="relative mb-3 inline-block">
          <img
            src={file ? URL.createObjectURL(file) : existingUrl}
            alt="Aperçu"
            className="h-36 w-36 rounded-soft object-cover border-2 border-nour-lavender-light"
          />
          <button
            type="button"
            onClick={() => {
              onFileChange(null);
              if (!file && onRemoveExisting) onRemoveExisting();
            }}
            aria-label="Retirer l'image"
            className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-nour-terracotta text-white shadow-soft"
          >
            <FiX size={16} />
          </button>
        </div>
      )}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-2 rounded-full border-2 border-dashed border-nour-lavender/50 px-4 py-2.5 text-sm font-medium text-nour-lavender-dark transition-colors hover:border-nour-lavender hover:bg-nour-lavender-pale"
      >
        <FiPlus size={16} />
        {file ? 'Remplacer l’image' : existingUrl ? 'Changer l’image' : 'Téléverser une image'}
      </button>
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={(e) => onFileChange(e.target.files?.[0] || null)} />
    </div>
  );
}
