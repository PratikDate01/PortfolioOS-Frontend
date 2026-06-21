import { API_BASE_URL } from './config';

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const getAuthToken = () => authToken;

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
