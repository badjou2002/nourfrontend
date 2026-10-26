import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiX } from 'react-icons/fi';
import FilterPanel from '../components/catalog/FilterPanel';
import SearchBar from '../components/catalog/SearchBar';
import SortSelect from '../components/catalog/SortSelect';
import ProductCard from '../components/catalog/ProductCard';
import Button from '../components/ui/Button';
import {
  searchProductsThunk,
  fetchFilterOptionsThunk,
  toggleFilterValue,
  setPriceRange,
  setFilter,
  setPage,
  resetFilters,
  setFiltersFromUrl,
  selectFilters,
  selectQueryParams,
} from '../features/catalog/catalogSlice';
import Doodles from '../components/layout/Doodles';

export default function CatalogPage() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filters = useSelector(selectFilters);
  const queryParams = useSelector(selectQueryParams);
  const { products, total, pages, loading, options, error } = useSelector((state) => state.catalog);
  const allFilters = useSelector(selectFilters);

  useEffect(() => {
    if (!filtersOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setFiltersOpen(false);
    };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [filtersOpen]);

  useEffect(() => {
    dispatch(fetchFilterOptionsThunk());
  }, [dispatch]);

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    dispatch(
      setFiltersFromUrl({
        q: params.q || '',
        category: params.category ? params.category.split(',').filter(Boolean) : [],
        formats: params.formats ? params.formats.split(',').filter(Boolean) : [],
        bindings: params.bindings ? params.bindings.split(',').filter(Boolean) : [],
        colors: params.colors ? params.colors.split(',').filter(Boolean) : [],
        availability: params.availability || '',
        promo: params.promo === 'true' ? 'true' : '',
        sort: params.sort || 'newest',
      })
    );
  }, [searchParams, dispatch]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(searchProductsThunk(queryParams));
    }, filters.q ? 350 : 0);
    return () => clearTimeout(timeout);
  }, [dispatch, queryParams]);

  const activeCount = useMemo(() => {
    let count = 0;
    if (filters.category.length) count += 1;
    if (filters.formats.length) count += 1;
    if (filters.bindings.length) count += 1;
    if (filters.colors.length) count += 1;
    if (filters.availability) count += 1;
    if (filters.minPrice !== '' && filters.maxPrice !== '') {
      if (filters.minPrice !== options.minPrice || filters.maxPrice !== options.maxPrice) count += 1;
    }
    return count;
  }, [filters, options]);

  const handleAvailability = (value) => {
    dispatch(setFilter({ key: 'availability', value }));
    syncUrl({ ...allFilters, availability: value });
  };
  const handleReset = () => {
    dispatch(resetFilters());
    setSearchParams({});
  };

  const syncUrl = (nextFilters) => {
    const params = {};
    if (nextFilters.q) params.q = nextFilters.q;
    if (nextFilters.category.length) params.category = nextFilters.category.join(',');
    if (nextFilters.formats.length) params.formats = nextFilters.formats.join(',');
    if (nextFilters.bindings.length) params.bindings = nextFilters.bindings.join(',');
    if (nextFilters.colors.length) params.colors = nextFilters.colors.join(',');
    if (nextFilters.availability) params.availability = nextFilters.availability;
    if (nextFilters.promo === 'true') params.promo = 'true';
    setSearchParams(params, { replace: true });
  };

  const handleSearch = (q) => {
    dispatch(setFilter({ key: 'q', value: q }));
    syncUrl({ ...filters, q });
  };

  const handleToggleSync = (key, value) => {
    dispatch(toggleFilterValue({ key, value }));
    const current = allFilters[key] || [];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    syncUrl({ ...allFilters, [key]: next });
  };

  return (
    <div className="relative bg-doodle-grid min-h-screen">
      <Doodles
        items={[
          { type: 'sparkle', top: '4%', right: '6%', size: 30 },
          { type: 'squiggle', top: '10%', left: '40%', size: 50 },
          { el: 3, top: '6%', left: '2%', size: 58, opacity: 0.5, rotate: -10 },
          { el: 10, bottom: '8%', right: '3%', size: 62, opacity: 0.5, rotate: 12 },
          { el: 14, top: '42%', left: '1%', size: 48, opacity: 0.45, rotate: 8 },
        ]}
      />
      <div className="container-nour relative py-10">
        <header className="mb-8 text-center">
          <p className="section-label mb-2 text-nour-teal">Notre catalogue</p>
          <h1 className="font-display text-4xl font-bold">Trouvez la pièce qui vous ressemble</h1>
          <p className="mx-auto mt-3 max-w-lg text-nour-ink/60">
            Filtrez par catégorie, prix, format ou disponibilité pour dénicher le bonheur papeterie.
          </p>
        </header>

        <div className="mx-auto mb-8 max-w-2xl">
          <SearchBar initialValue={filters.q} onSearch={handleSearch} />
        </div>

        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-nour-ink/50">
            <span className="font-semibold text-nour-ink">{total}</span> article{total > 1 ? 's' : ''} trouvé{total > 1 ? 's' : ''}
          </p>
          <SortSelect value={filters.sort} onChange={(value) => dispatch(setFilter({ key: 'sort', value }))} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
          <div className="hidden lg:block">
            <FilterPanel
              options={options}
              filters={filters}
              onToggle={handleToggleSync}
              onPriceChange={(range) => dispatch(setPriceRange(range))}
              onAvailability={handleAvailability}
              onReset={handleReset}
              activeCount={activeCount}
            />
          </div>

          <div>
            {loading ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="card-nour h-72 animate-pulse bg-nour-lavender-pale/60" />
                ))}
              </div>
            ) : error ? (
              <div className="py-16 text-center">
                <p className="font-display text-xl text-nour-terracotta">Une erreur est survenue</p>
                <p className="mt-2 text-sm text-nour-ink/60">{error}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center py-20 text-center">
                <span className="mb-4 text-6xl">🔍</span>
                <h3 className="font-display text-xl font-semibold">Aucun produit ne correspond</h3>
                <p className="mt-2 max-w-sm text-sm text-nour-ink/60">
                  Essayez d’élargir vos filtres ou de modifier votre recherche.
                </p>
                <Button variant="teal" className="mt-6" onClick={handleReset}>
                  Réinitialiser les filtres
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {pages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={filters.page <= 1}
                      onClick={() => dispatch(setPage(filters.page - 1))}
                    >
                      Précédent
                    </Button>
                    {Array.from({ length: pages }).slice(0, 8).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => dispatch(setPage(i + 1))}
                        className={`h-10 w-10 rounded-full font-display text-sm transition-colors ${
                          filters.page === i + 1
                            ? 'bg-nour-lavender text-white shadow-doodle'
                            : 'bg-white text-nour-ink/70 hover:bg-nour-lavender-pale'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={filters.page >= pages}
                      onClick={() => dispatch(setPage(filters.page + 1))}
                    >
                      Suivant
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setFiltersOpen(true)}
        aria-label={`Ouvrir les filtres${activeCount ? `, ${activeCount} actif(s)` : ''}`}
        className="fixed left-0 top-1/2 z-30 flex -translate-y-1/2 items-center gap-2 rounded-r-full bg-nour-lavender px-3 py-3 text-sm font-semibold text-white shadow-doodle transition-transform hover:translate-x-1 lg:hidden"
      >
        <FiFilter size={20} />
        <span className="sr-only">Filtres</span>
        {activeCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-xs text-nour-lavender-dark">
            {activeCount}
          </span>
        )}
      </button>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            onClick={() => setFiltersOpen(false)}
            aria-label="Fermer les filtres"
            className="absolute inset-0 h-full w-full bg-nour-ink/40"
          />
          <section
            role="dialog"
            aria-modal="true"
            aria-label="Filtres du catalogue"
            className="absolute inset-y-0 left-0 flex w-[min(88vw,360px)] flex-col overflow-y-auto bg-white p-5 shadow-2xl"
          >
            <div className="mb-2 flex justify-end">
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                aria-label="Fermer les filtres"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-nour-lavender-pale text-nour-lavender-dark"
              >
                <FiX size={20} />
              </button>
            </div>
            <FilterPanel
              options={options}
              filters={filters}
              onToggle={handleToggleSync}
              onPriceChange={(range) => dispatch(setPriceRange(range))}
              onAvailability={handleAvailability}
              onReset={handleReset}
              activeCount={activeCount}
              className="flex flex-col gap-4"
            />
          </section>
        </div>
      )}
    </div>
  );
}
