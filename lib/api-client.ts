import { API_BASE_URL } from './config';

let authToken: string | null = null;
let refreshToken: string | null = null;

// Helper to safely access localStorage in Next.js (SSR safe)
const getStorageItem = (key: string): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};

const setStorageItem = (key: string, value: string | null) => {
  if (typeof window !== 'undefined') {
    if (value) {
      localStorage.setItem(key, value);
    } else {
      localStorage.removeItem(key);
    }
  }
};

export const setAuthToken = (token: string | null) => {
  authToken = token;
  setStorageItem('authToken', token);
};

export const getAuthToken = () => {
  if (!authToken) {
    authToken = getStorageItem('authToken');
  }
  return authToken;
};

export const setRefreshToken = (token: string | null) => {
  refreshToken = token;
  setStorageItem('refreshToken', token);
};

export const getRefreshToken = () => {
  if (!refreshToken) {
    refreshToken = getStorageItem('refreshToken');
  }
  return refreshToken;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const apiFetch = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data?: T; error?: string }> => {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      credentials: 'include', // Ensure cookies are passed
      ...options,
      headers,
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || 'API Request failed' };
    }

    return result;
  } catch (err) {
    return { error: (err as Error).message || 'Network error' };
  }
};
