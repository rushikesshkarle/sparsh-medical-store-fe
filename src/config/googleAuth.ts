/**
 * Google OAuth client id. Must equal the backend's GOOGLE_CLIENT_ID, or Google
 * rejects the code exchange. Empty = sign-in is shown as not configured.
 */
export const GOOGLE_CLIENT_ID = (import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '').trim();
