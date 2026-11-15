import type { Admin } from '../types/auth';
import type { CartItem } from '../types/product';

/** The admin session lives in sessionStorage (ends with the tab); the cart in localStorage. */
const TOKEN_KEY = 'sm_token';
const ADMIN_KEY = 'sm_admin';
const CART_KEY = 'sparshCart';

function read<T>(storage: Storage, key: string): T | null {
  try {
    const raw = storage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(storage: Storage, key: string, value: unknown): void {
  try {
    storage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  } catch {
    // Storage full or blocked (private mode) — the app still works without it.
  }
}

export const StorageService = {
  getToken(): string | null {
    try {
      return sessionStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  setToken(token: string): void {
    write(sessionStorage, TOKEN_KEY, token);
  },
  getAdmin(): Admin | null {
    return read<Admin>(sessionStorage, ADMIN_KEY);
  },
  setAdmin(admin: Admin): void {
    write(sessionStorage, ADMIN_KEY, admin);
  },
  clearSession(): void {
    try {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(ADMIN_KEY);
      sessionStorage.removeItem('sm_user'); // key from the removed Google sign-in
    } catch {
      // ignore
    }
  },
  getCart(): CartItem[] {
    const cart = read<CartItem[]>(localStorage, CART_KEY);
    return Array.isArray(cart) ? cart.filter((i) => i && typeof i.id === 'string') : [];
  },
  setCart(cart: CartItem[]): void {
    write(localStorage, CART_KEY, cart);
  },
};
