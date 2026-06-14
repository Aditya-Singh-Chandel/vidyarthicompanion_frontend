'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getToken } from '@/lib/apiClient';
import * as authApi from './authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hydrate the session from a stored token on first load.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!getToken()) {
        setLoading(false);
        return;
      }
      const me = await authApi.fetchMe();
      if (!cancelled) {
        setUser(me);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (credentials) => {
    const { user: u } = await authApi.login(credentials);
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (details) => {
    const { user: u } = await authApi.register(details);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
