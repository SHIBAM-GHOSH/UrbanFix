import axios from 'axios';
import { clearToken, getToken } from '../utils/auth';

let rawBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim();
if (rawBaseUrl && !rawBaseUrl.startsWith('http://') && !rawBaseUrl.startsWith('https://') && !rawBaseUrl.startsWith('/')) {
  rawBaseUrl = `https://${rawBaseUrl}`;
}

const baseURL = rawBaseUrl
  ? (rawBaseUrl.endsWith('/api') ? rawBaseUrl : `${rawBaseUrl.replace(/\/$/, '')}/api`)
  : '/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 1. Network Failure / Backend Unreachable
    if (!error.response) {
      const customNetworkError = new Error(
        'Unable to connect to the UrbanFix server. Please check your internet connection or verify the backend is running.',
      );
      customNetworkError.isNetworkError = true;
      return Promise.reject(customNetworkError);
    }

    // 2. JWT Expired or Unauthorized (401)
    if (error.response.status === 401) {
      clearToken();

      if (window.location.pathname !== '/login') {
        window.location.assign('/login?sessionExpired=true');
      }
    }

    return Promise.reject(error);
  },
);

export default api;

