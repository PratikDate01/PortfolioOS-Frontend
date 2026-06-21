const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Remove trailing slash if present
const baseUrl = rawApiUrl.replace(/\/$/, '');

// Centralized endpoints
export const API_BASE_URL = baseUrl.endsWith('/api/v1') ? baseUrl : `${baseUrl}/api/v1`;
export const BACKEND_URL = baseUrl;
