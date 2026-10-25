import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { fetchProducts, fetchFilterOptions } from '../../services/products';

const defaultFilters = {
  q: '',
  category: [],
  minPrice: '',
  maxPrice: '',
  formats: [],
  bindings: [],
  colors: [],
  availability: '',
  promo: '',
  sort: 'newest',
  page: 1,
  limit: 12,
};

export const searchProductsThunk = createAsyncThunk(
  'catalog/search',
  async (params, { rejectWithValue }) => {
    try {
      return await fetchProducts(params);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchFilterOptionsThunk = createAsyncThunk(
  'catalog/fetchOptions',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchFilterOptions();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const buildQueryParams = (filters) => {
  const params = {
    page: filters.page,
    limit: filters.limit,
    sort: filters.sort,
  };
  if (filters.q) params.q = filters.q;
  if (filters.category.length) params.category = filters.category.join(',');
  if (filters.minPrice !== '') params.minPrice = filters.minPrice;
  if (filters.maxPrice !== '') params.maxPrice = filters.maxPrice;
  if (filters.formats.length) params.formats = filters.formats.join(',');
  if (filters.bindings.length) params.bindings = filters.bindings.join(',');
  if (filters.colors.length) params.colors = filters.colors.join(',');
  if (filters.availability) params.availability = filters.availability;
  if (filters.promo === 'true') params.promo = 'true';
  return params;
};

const catalogSlice = createSlice({
  name: 'catalog',
  initialState: {
    filters: defaultFilters,
    products: [],
    total: 0,
    pages: 1,
    page: 1,
    options: {
      categories: [],
      minPrice: 0,
      maxPrice: 150,
      formats: [],
      bindings: [],
      colors: [],
    },
    loading: false,
    optionsLoading: false,
    error: null,
  },
  reducers: {
    setFilter: (state, action) => {
      const { key, value } = action.payload;
      state.filters[key] = value;
      if (key !== 'page') state.filters.page = 1;
    },
    toggleFilterValue: (state, action) => {
      const { key, value } = action.payload;
      const list = state.filters[key];
      if (list.includes(value)) {
        state.filters[key] = list.filter((v) => v !== value);
      } else {
        state.filters[key] = [...list, value];
      }
      state.filters.page = 1;
    },
    setPriceRange: (state, action) => {
      const [min, max] = action.payload;
      state.filters.minPrice = min;
      state.filters.maxPrice = max;
      state.filters.page = 1;
    },
    setPage: (state, action) => {
      state.filters.page = action.payload;
    },
    resetFilters: (state) => {
      state.filters = { ...defaultFilters };
    },
    setFiltersFromUrl: (state, action) => {
      const next = action.payload;
      const same = (a, b) => {
        if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((v, i) => v === b[i]);
        return a === b;
      };
      let changed = false;
      for (const key of Object.keys(next)) {
        if (!same(next[key], state.filters[key])) {
          changed = true;
          break;
        }
      }
      if (changed) state.filters = { ...state.filters, ...next, page: 1 };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchProductsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProductsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data;
        state.total = action.payload.pagination.total;
        state.pages = action.payload.pagination.pages;
        state.page = action.payload.pagination.page;
      })
      .addCase(searchProductsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchFilterOptionsThunk.pending, (state) => {
        state.optionsLoading = true;
      })
      .addCase(fetchFilterOptionsThunk.fulfilled, (state, action) => {
        state.optionsLoading = false;
        state.options = action.payload;
        state.filters.minPrice = state.filters.minPrice === '' ? action.payload.minPrice : state.filters.minPrice;
        state.filters.maxPrice = state.filters.maxPrice === '' ? action.payload.maxPrice : state.filters.maxPrice;
      })
      .addCase(fetchFilterOptionsThunk.rejected, (state) => {
        state.optionsLoading = false;
      });
  },
});

export const { setFilter, toggleFilterValue, setPriceRange, setPage, resetFilters, setFiltersFromUrl } = catalogSlice.actions;

export const selectFilters = (state) => state.catalog.filters;

export const selectQueryParams = createSelector(
  [(state) => state.catalog.filters],
  (filters) => buildQueryParams(filters)
);

export default catalogSlice.reducer;
