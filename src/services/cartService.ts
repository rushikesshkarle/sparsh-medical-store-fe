import apiClient from './api';
import { API_ENDPOINTS } from '../config/api';
import type { CustomResponse } from '../types/api';
import type { CartItem } from '../types/product';

/** A cart line as the backend returns it (current name and price). */
interface ServerCartLine extends CartItem {
  image_url: string | null;
  in_stock: boolean;
}

const toItems = (lines: ServerCartLine[]): CartItem[] =>
  lines.map(({ id, name, price, quantity }) => ({ id, name, price, quantity }));

/** The signed-in user's saved cart. Guests never call this. */
export const cartService = {
  async get(): Promise<CartItem[]> {
    const { data } = await apiClient.get<CustomResponse<{ items: ServerCartLine[] }>>(API_ENDPOINTS.CART);
    return toItems(data.result.items);
  },

  /** Replace the saved cart; returns it with deleted/hidden products dropped. */
  async save(items: CartItem[]): Promise<CartItem[]> {
    const { data } = await apiClient.put<CustomResponse<{ items: ServerCartLine[] }>>(API_ENDPOINTS.CART, {
      items: items.map(({ id, quantity }) => ({ id, quantity })),
    });
    return toItems(data.result.items);
  },
};

/** Guest cart + saved cart on sign-in: union of both; a product in both keeps the larger quantity. */
export function mergeCarts(saved: CartItem[], guest: CartItem[]): CartItem[] {
  const merged = saved.map((item) => ({ ...item }));
  for (const item of guest) {
    const existing = merged.find((m) => m.id === item.id);
    if (existing) existing.quantity = Math.max(existing.quantity, item.quantity);
    else merged.push({ ...item });
  }
  return merged;
}
