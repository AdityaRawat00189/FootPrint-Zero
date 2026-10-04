import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('fpz_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('fpz_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('fpz_token');
      if (savedToken) {
        try {
          const res = await axiosClient.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.data);
            localStorage.setItem('fpz_user', JSON.stringify(res.data.data));
          }
        } catch (err) {
          console.error('[AuthContext] Session expired:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await axiosClient.post('/auth/login', { email, password });
    if (res.data.success) {
      const { token: newToken, ...userData } = res.data.data;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('fpz_token', newToken);
      localStorage.setItem('fpz_user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, message: res.data.message };
  };

  const register = async (formData) => {
    const res = await axiosClient.post('/auth/register', formData);
    if (res.data.success) {
      const { token: newToken, ...userData } = res.data.data;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('fpz_token', newToken);
      localStorage.setItem('fpz_user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, message: res.data.message };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('fpz_token');
    localStorage.removeItem('fpz_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
