/**
 * Backend endpoint map (sparsh-medical-be). All routes live under /api/v1 and
 * return the CustomResponse<T> envelope. An empty VITE_API_BASE_URL means
 * same-origin (nginx in production, the Vite proxy in development).
 */
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');
const V1 = `${API_BASE_URL}/api/v1`;

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${V1}/auth/login`,
  ME: `${V1}/auth/me`,

  // Public storefront
  PRODUCTS: `${V1}/products`,
  PRODUCT_CATEGORIES: `${V1}/products/categories`,
  PRODUCT: (id: string) => `${V1}/products/${id}`,

  // Admin catalogue (Bearer-gated)
  ADMIN_PRODUCTS: `${V1}/admin/products`,
  ADMIN_PRODUCT_STATS: `${V1}/admin/products/stats`,
  ADMIN_PRODUCT: (id: string) => `${V1}/admin/products/${id}`,
};

export { API_BASE_URL };
