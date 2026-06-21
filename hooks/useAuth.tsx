'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch, setAuthToken, getAuthToken } from '../lib/api-client';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isCheckingSession: boolean;
  login: (credentials: { email: string; password?: string; isGuest?: boolean }) => Promise<{ token: string; user: User }>;
  register: (userData: { name: string; email: string; password?: string }) => Promise<{ token: string; user: User }>;
  isLoggingIn: boolean;
  isRegistering: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await apiFetch<{ token: string; user: User }>('/auth/refresh', {
          method: 'POST',
        });
        if (res.data) {
          setAuthToken(res.data.token);
          queryClient.setQueryData(['me'], res.data.user);
        }
      } catch (err) {
        console.error('Session initialization failed:', err);
      } finally {
        setIsCheckingSession(false);
        setIsInitialized(true);
      }
    };
    initAuth();
  }, [queryClient]);

  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ['me'],
    queryFn: async () => {
      const token = getAuthToken();
      if (!token) return null;
      const res = await apiFetch<User>('/auth/me');
      if (res.error) {
        setAuthToken(null);
        return null;
      }
      return res.data || null;
    },
    enabled: isInitialized && !isCheckingSession && !!getAuthToken(),
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password?: string; isGuest?: boolean }) => {
      const endpoint = credentials.isGuest ? '/auth/guest' : '/auth/login';
      const body = credentials.isGuest ? undefined : { email: credentials.email, password: credentials.password };
      
      const res = await apiFetch<{ token: string; user: User }>(endpoint, {
        method: 'POST',
        body: body ? JSON.stringify(body) : undefined,
      });

      if (res.error) {
        throw new Error(res.error);
      }

      return res.data!;
    },
    onSuccess: (data) => {
      setAuthToken(data.token);
      queryClient.setQueryData(['me'], data.user);
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: { name: string; email: string; password?: string }) => {
      const res = await apiFetch<{ token: string; user: User }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      if (res.error) {
        throw new Error(res.error);
      }

      return res.data!;
    },
    onSuccess: (data) => {
      setAuthToken(data.token);
      queryClient.setQueryData(['me'], data.user);
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiFetch('/auth/logout', { method: 'POST' });
    },
    onSuccess: () => {
      setAuthToken(null);
      queryClient.setQueryData(['me'], null);
      queryClient.invalidateQueries({ queryKey: ['me'] });
    }
  });

  const logout = () => {
    logoutMutation.mutate();
  };

  const value = {
    user: user || null,
    isLoading: isCheckingSession || (isLoading && !!getAuthToken()),
    isCheckingSession,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
