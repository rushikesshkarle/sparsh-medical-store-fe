import axios from 'axios';
import { StorageService } from '../utils/StorageUtils';
import type { CustomError } from '../types/api';

/** Shared axios client. Attaches the Bearer token when present and, on a 401
 * (expired or revoked session), clears the session and bounces to sign-in. */
const apiClient = axios.create({ timeout: 30_000 });

apiClient.interceptors.request.use((config) => {
  const token = StorageService.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLogin = String(error.config?.url ?? '').endsWith('/auth/google');
    if (error.response?.status === 401 && !isLogin && StorageService.getToken()) {
      StorageService.clearSession();
      window.location.assign('/login');
    }
    return Promise.reject(error);
  },
);

/** Pull a human-readable message out of an error in the backend's envelope. */
export const extractErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError<CustomError>(error)) {
    const data = error.response?.data;
    if (Array.isArray(data?.error) && data.error.length) {
      return data.error.map((e) => (e.field ? `${e.field}: ${e.msg}` : e.msg)).join('; ');
    }
    if (data?.message) return data.message;
    if (!error.response) return 'Cannot reach the server. Please check your connection.';
    return error.message;
  }
  if (error instanceof Error && error.message) return error.message;
  return 'An unexpected error occurred';
};

export default apiClient;
