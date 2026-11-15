import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { StorageService } from '../utils/StorageUtils';
import { useAuth } from './AuthContext';
import { cartService, mergeCarts } from '../services/cartService';
import type { CartItem, Product } from '../types/product';

interface CartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (product: Product) => void;
  quantityOf: (id: string) => number;
  setQuantity: (id: string, quantity: number) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

/** Cart kept in localStorage for everyone. For a signed-in user it is also saved
 * on their account: on sign-in the guest cart is merged into the saved one, then
 * every change is saved (debounced). Signing out empties the cart on this device.
 * Orders are sent to the store over WhatsApp — there is no online payment. */
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => StorageService.getCart());
  const [isOpen, setIsOpen] = useState(false);

  const { isAuthenticated, user } = useAuth();
  const userId = isAuthenticated ? (user?.id ?? null) : null;
  // The user whose saved cart has been merged in; changes are saved only after that.
  const syncedFor = useRef<string | null>(null);
  const previousUser = useRef(userId);

  useEffect(() => StorageService.setCart(items), [items]);

  // Sign-in (or a page load with a session): merge guest + saved cart, save the result.
  useEffect(() => {
    if (!userId) {
      if (previousUser.current) setItems([]); // signed out here
      previousUser.current = null;
      syncedFor.current = null;
      return;
    }
    previousUser.current = userId;
    let alive = true;
    (async () => {
      try {
        const saved = await cartService.get();
        if (!alive) return;
        const merged = await cartService.save(mergeCarts(saved, StorageService.getCart()));
        if (!alive) return;
        syncedFor.current = userId;
        setItems(merged);
      } catch {
        // Offline or server error: keep the local cart; it merges on the next load.
      }
    })();
    return () => {
      alive = false;
    };
  }, [userId]);

  // After the merge, save every change for the signed-in user (debounced).
  useEffect(() => {
    if (!userId || syncedFor.current !== userId) return;
    const timer = window.setTimeout(() => {
      cartService.save(items).catch(() => {
        /* next change retries */
      });
    }, 600);
    return () => window.clearTimeout(timer);
  }, [items, userId]);

  const add = useCallback((product: Product) => {
    setItems((current) => {
      const existing = current.find((i) => i.id === product.id);
      if (existing) {
        return current.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...current, { id: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
  }, []);

  const setQuantity = useCallback((id: string, quantity: number) => {
    setItems((current) =>
      quantity <= 0 ? current.filter((i) => i.id !== id) : current.map((i) => (i.id === id ? { ...i, quantity } : i)),
    );
  }, []);

  const quantityOf = useCallback((id: string) => items.find((i) => i.id === id)?.quantity ?? 0, [items]);

  const remove = useCallback((id: string) => setItems((c) => c.filter((i) => i.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.quantity, 0),
      total: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      isOpen,
      open,
      close,
      add,
      quantityOf,
      setQuantity,
      remove,
      clear,
    }),
    [items, isOpen, open, close, add, quantityOf, setQuantity, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
