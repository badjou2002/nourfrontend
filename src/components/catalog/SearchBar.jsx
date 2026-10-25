import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';
import { fetchAutocomplete } from '../../services/products';
import { formatTND } from '../../utils/format';

export default function SearchBar({ initialValue = '', onSearch }) {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const debounceRef = useRef(null);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (value) => {
    setQuery(value);
    setActiveIndex(-1);
    clearTimeout(debounceRef.current);
    if (!value.trim()) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    setOpen(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await fetchAutocomplete(value);
        setSuggestions(results);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const submit = (value) => {
    const q = (value ?? query).trim();
    setOpen(false);
    if (onSearch) onSearch(q);
    else if (q) navigate(`/catalogue?q=${encodeURIComponent(q)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    else if (e.key === 'ArrowUp') setActiveIndex((i) => Math.max(i - 1, 0));
    else if (e.key === 'Enter') {
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        navigate(`/produit/${suggestions[activeIndex].slug}`);
        setOpen(false);
      } else submit(query);
    } else if (e.key === 'Escape') setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-nour-lavender" />
        <input
          type="search"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setOpen(true)}
          placeholder="Rechercher un planner, un mug, un bloc-notes..."
          className="input-nour rounded-full py-3.5 pl-11 pr-11"
        />
        {query && (
          <button
            onClick={() => handleChange('')}
            aria-label="Effacer"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-nour-ink/40 hover:text-nour-ink"
          >
            <FiX size={18} />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-soft bg-white shadow-doodle-lg">
          {loading && <div className="px-4 py-3 text-sm text-nour-ink/50">Recherche en cours...</div>}
          {!loading && !suggestions.length && (
            <div className="px-4 py-3 text-sm text-nour-ink/50">Aucune suggestion pour « {query} »</div>
          )}
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion._id}
              onClick={() => {
                navigate(`/produit/${suggestion.slug}`);
                setOpen(false);
              }}
              onMouseEnter={() => setActiveIndex(index)}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                activeIndex === index ? 'bg-nour-lavender-pale' : 'hover:bg-nour-lavender-pale/50'
              }`}
            >
              {suggestion.imagesCloudinary?.[0]?.url && (
                <img src={suggestion.imagesCloudinary[0].url} alt="" className="h-10 w-10 rounded-soft object-cover" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-nour-ink">{suggestion.title}</p>
                <p className="text-xs text-nour-lavender-dark">{suggestion.category?.name || 'Produit'}</p>
              </div>
              <span className="text-sm font-semibold text-nour-lavender-dark">{formatTND(suggestion.price)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
