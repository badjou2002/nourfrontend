import client from '../api/client';

export const fetchProducts = async (params = {}) => {
  const { data } = await client.get('/filter', { params });
  return data;
};

export const fetchFilterOptions = async () => {
  const { data } = await client.get('/filter/options');
  return data.data;
};

export const fetchAutocomplete = async (q) => {
  const { data } = await client.get('/filter/autocomplete', { params: { q } });
  return data.data;
};

export const fetchProductBySlug = async (slug) => {
  const { data } = await client.get(`/products/slug/${slug}`);
  return data.data;
};

export const fetchSimilarProducts = async (slug) => {
  const { data } = await client.get(`/products/similar/${slug}`);
  return data.data;
};

export const fetchCategories = async () => {
  const { data } = await client.get('/categories');
  return data.data;
};
