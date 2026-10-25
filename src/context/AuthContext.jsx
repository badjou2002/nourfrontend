import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import client from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('nour_token'));
  const [loading, setLoading] = useState(!!localStorage.getItem('nour_token'));

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    client
      .get('/auth/me')
      .then((res) => {
        if (!cancelled) setUser(res.data.data);
      })
      .catch(() => {
        localStorage.removeItem('nour_token');
        if (!cancelled) {
          setToken(null);
          setUser(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const login = async (email, password) => {
    const res = await client.post('/auth/login', { email, password });
    localStorage.setItem('nour_token', res.data.data.token);
    setToken(res.data.data.token);
    setUser(res.data.data);
    return res.data.data;
  };

  const register = async ({ name, email, password, phone, address }) => {
    const res = await client.post('/auth/register', { name, email, password, phone, address });
    localStorage.setItem('nour_token', res.data.data.token);
    setToken(res.data.data.token);
    setUser(res.data.data);
    return res.data.data;
  };

  const logout = () => {
    localStorage.removeItem('nour_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async ({ name, phone, address, password }) => {
    const res = await client.put('/auth/profile', { name, phone, address, password });
    setUser(res.data.data);
    return res.data.data;
  };

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout, updateProfile, isAdmin: user?.role === 'admin' }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth doit être utilisé dans un AuthProvider');
  return context;
};
