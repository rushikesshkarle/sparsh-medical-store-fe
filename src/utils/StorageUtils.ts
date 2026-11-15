import type { User } from '../types/auth';
import type { CartItem } from '../types/product';

/** The sign-in session lives in sessionStorage (ends with the tab); the cart in localStorage. */
const TOKEN_KEY = 'sm_token';
const USER_KEY = 'sm_user';
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
  getUser(): User | null {
    return read<User>(sessionStorage, USER_KEY);
  },
  setUser(user: User): void {
    write(sessionStorage, USER_KEY, user);
  },
  clearSession(): void {
    try {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
      sessionStorage.removeItem('sm_admin'); // pre-Google-login key
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
