import client from '../api/client';

export const getStats = async () => {
  const { data } = await client.get('/admin/stats');
  return data.data;
};

export const getShippingSettings = async () => {
  const { data } = await client.get('/admin/shipping-rates');
  return data.data;
};

export const updateShippingSettings = async (payload) => {
  const { data } = await client.put('/admin/shipping-rates', payload);
  return data.data;
};

export const getProducts = async (params = {}) => {
  const { data } = await client.get('/products/admin', { params });
  return data;
};

export const getProduct = async (id) => {
  const { data } = await client.get(`/products/${id}`);
  return data.data;
};

export const createProduct = async (formData) => {
  const { data } = await client.post('/products', formData);
  return data.data;
};

export const updateProduct = async (id, formData) => {
  const { data } = await client.put(`/products/${id}`, formData);
  return data.data;
};

export const deleteProduct = async (id) => {
  const { data } = await client.delete(`/products/${id}`);
  return data;
};

export const getCategories = async (includeInactive = false) => {
  const { data } = await client.get('/categories', { params: { includeInactive } });
  return data.data;
};

export const createCategory = async (formData) => {
  const { data } = await client.post('/categories', formData);
  return data.data;
};

export const updateCategory = async (id, formData) => {
  const { data } = await client.put(`/categories/${id}`, formData);
  return data.data;
};

export const deleteCategory = async (id) => {
  const { data } = await client.delete(`/categories/${id}`);
  return data;
};

export const reorderCategories = async (ids) => {
  const { data } = await client.put('/categories/reorder', { ids });
  return data;
};

export const getWelcomePage = async () => {
  const { data } = await client.get('/welcome-page');
  return data.data;
};

export const updateWelcomePage = async (payload) => {
  const { data } = await client.put('/welcome-page', payload);
  return data.data;
};

export const addHeroBanner = async (formData) => {
  const { data } = await client.post('/welcome-page/banners', formData);
  return data.data;
};

export const updateHeroBanner = async (id, formData) => {
  const { data } = await client.put(`/welcome-page/banners/${id}`, formData);
  return data.data;
};

export const deleteHeroBanner = async (id) => {
  const { data } = await client.delete(`/welcome-page/banners/${id}`);
  return data.data;
};

export const getOrders = async (params = {}) => {
  const { data } = await client.get('/orders', { params });
  return data;
};

export const getOrder = async (id) => {
  const { data } = await client.get(`/orders/${id}`);
  return data.data;
};

export const updateOrderStatus = async (id, payload) => {
  const { data } = await client.patch(`/orders/${id}/status`, payload);
  return data.data;
};

export const downloadInvoice = async (id) => {
  const response = await client.get(`/orders/${id}/invoice`, { responseType: 'blob' });
  const disposition = response.headers['content-disposition'] || '';
  const match = disposition.match(/filename="?([^"]+)"?/);
  const filename = match ? match[1] : `facture-${id}.pdf`;
  const url = URL.createObjectURL(response.data);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
