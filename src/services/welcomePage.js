import client from '../api/client';

export const fetchWelcomePage = async () => {
  const { data } = await client.get('/welcome-page');
  return data.data;
};

export const fetchFeaturedProducts = async () => {
  const { data } = await client.get('/welcome-page/featured');
  return data.data;
};
