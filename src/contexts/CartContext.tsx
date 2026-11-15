import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { StorageService } from '../utils/StorageUtils';
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

/** Browser-side cart (localStorage); customers shop as guests. Orders are sent
 * to the store over WhatsApp — there is no online payment. */
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => StorageService.getCart());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => StorageService.setCart(items), [items]);

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
