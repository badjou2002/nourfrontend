import client from '../api/client';

export const fetchMyOrders = async () => {
  const { data } = await client.get('/orders/my-orders');
  return data.data;
};

export const fetchOrderById = async (id) => {
  const { data } = await client.get(`/orders/${id}`);
  return data.data;
};

export const placeOrder = async (payload) => {
  const { data } = await client.post('/orders', payload);
  return data.data;
};

export const cancelOrder = async (id) => {
  const { data } = await client.patch(`/orders/${id}/cancel`);
  return data.data;
};
