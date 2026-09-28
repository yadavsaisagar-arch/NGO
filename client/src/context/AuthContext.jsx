import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Check for active session upon mounting by querying /api/auth/me
  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const data = await authService.getMe();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } catch (err) {
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login handler
  const login = async (credentials) => {
    setAuthError(null);
    try {
      const data = await authService.login(credentials);
      if (data.success && data.user) {
        setUser(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message || 'Login failed' };
    } catch (err) {
      const msg = err.message || 'Failed to login. Please check your credentials.';
      setAuthError(msg);
      return { success: false, message: msg };
    }
  };

  // Register handler
  const register = async (userData) => {
    setAuthError(null);
    try {
      const data = await authService.register(userData);
      if (data.success && data.user) {
        setUser(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message || 'Registration failed' };
    } catch (err) {
      const msg = err.message || 'Registration failed. Please check your details.';
      setAuthError(msg);
      return { success: false, message: msg };
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn('Logout API error:', err);
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    authError,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    login,
    register,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
