import { useCallback, useEffect, useState } from 'react';
import { extractErrorMessage } from '../services/api';
import { productService } from '../services/productService';
import type { Product, ProductListParams } from '../types/product';

interface UseProductsResult {
  products: Product[];
  total: number;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  reload: () => void;
}

interface Settled {
  key: string;
  products: Product[];
  total: number;
  error: string | null;
}

/** Paged product listing that restarts from page 1 whenever the filters change.
 *
 * `loading` is derived — the latest request's key differs from the last settled
 * one — so the effect only sets state from the async callback. */
export function useProducts(
  { q, category, sort, in_stock, status }: Pick<ProductListParams, 'q' | 'category' | 'sort' | 'in_stock' | 'status'>,
  { admin = false, pageSize = 24 }: { admin?: boolean; pageSize?: number } = {},
): UseProductsResult {
  const [reloadKey, setReloadKey] = useState(0);

  // The page belongs to one set of filters: new filters (or a reload) mean page 1.
  const filterKey = [admin, pageSize, q ?? '', category ?? '', sort ?? '', in_stock ?? '', status ?? '', reloadKey].join('|');
  const [pageState, setPageState] = useState({ key: filterKey, page: 1 });
  const page = pageState.key === filterKey ? pageState.page : 1;
  const requestKey = `${filterKey}|${page}`;

  const [settled, setSettled] = useState<Settled>({ key: '', products: [], total: 0, error: null });

  useEffect(() => {
    let alive = true;
    const fetchPage = admin ? productService.adminList : productService.list;
    fetchPage({ q, category, sort, in_stock, status, page, page_size: pageSize })
      .then((result) => {
        if (!alive) return;
        setSettled((prev) => ({
          key: requestKey,
          // Page 1 replaces the list; later pages append to the same filter's list.
          products: page === 1 ? result.items : [...prev.products, ...result.items],
          total: result.total,
          error: null,
        }));
      })
      .catch((err) => {
        if (!alive) return;
        setSettled((prev) => ({ ...prev, key: requestKey, error: extractErrorMessage(err) }));
      });
    return () => {
      alive = false;
    };
  }, [q, category, sort, in_stock, status, page, pageSize, admin, requestKey]);

  const loading = settled.key !== requestKey;
  // While page 1 of new filters loads, don't show the previous filter's products.
  const products = loading && page === 1 ? [] : settled.products;

  const loadMore = useCallback(() => setPageState({ key: filterKey, page: page + 1 }), [filterKey, page]);
  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  return {
    products,
    total: settled.total,
    loading,
    error: loading ? null : settled.error,
    hasMore: !loading && settled.products.length < settled.total,
    loadMore,
    reload,
  };
}
