import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle session expiration gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred.';

    // If 401 Unauthorized occurs on protected routes (not on initial /me check)
    if (error.response?.status === 401 && !error.config.url.includes('/auth/me')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
