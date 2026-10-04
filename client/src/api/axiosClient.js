import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to all outgoing requests
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fpz_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response error handler
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token on unauthorized if not on auth page
      if (!window.location.pathname.includes('/auth')) {
        localStorage.removeItem('fpz_token');
        localStorage.removeItem('fpz_user');
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
