import { API_BASE_URL } from '../config/api';

/** The backend returns image URLs relative to itself (/media/...); make them loadable. */
export const resolveMediaUrl = (url: string | null): string | null => {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_BASE_URL}${url}`;
};
