import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import StoreHeader from '../../components/StoreHeader/StoreHeader';
import CategoryNav from '../../components/CategoryNav/CategoryNav';
import HeroBanner from '../../components/HeroBanner/HeroBanner';
import TrustStrip from '../../components/TrustStrip/TrustStrip';
import CategoryGrid from '../../components/CategoryGrid/CategoryGrid';
import ProductCatalog from '../../components/ProductCatalog/ProductCatalog';
import WhatsAppBand from '../../components/WhatsAppBand/WhatsAppBand';
import VisitStore from '../../components/VisitStore/VisitStore';
import StoreFooter from '../../components/StoreFooter/StoreFooter';
import CartDrawer from '../../components/CartDrawer/CartDrawer';
import MobileCartBar from '../../components/MobileCartBar/MobileCartBar';
import { CartProvider } from '../../contexts/CartContext';
import { useProducts } from '../../hooks/useProducts';
import type { ProductSort } from '../../types/product';

const SORTS: ProductSort[] = ['newest', 'price_asc', 'price_desc'];

const scrollToProducts = () =>
  requestAnimationFrame(() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }));

type Filters = { q: string; category: string; sort: ProductSort; inStock: boolean };

/** The storefront. Filters live in the URL (?q=&category=&sort=&in_stock=1) so links are shareable. */
export default function StorePage() {
  const [params, setParams] = useSearchParams();
  const filters: Filters = {
    q: params.get('q') ?? '',
    category: params.get('category') ?? '',
    sort: SORTS.find((s) => s === params.get('sort')) ?? 'newest',
    inStock: params.get('in_stock') === '1',
  };
  const { products, total, loading, error, hasMore, loadMore, reload } = useProducts({
    q: filters.q,
    category: filters.category,
    sort: filters.sort,
    in_stock: filters.inStock,
  });

  const update = useCallback(
    (next: Partial<Filters>, scroll = true) => {
      const merged = { ...filters, ...next };
      const search = new URLSearchParams();
      if (merged.q) search.set('q', merged.q);
      if (merged.category) search.set('category', merged.category);
      if (merged.sort !== 'newest') search.set('sort', merged.sort);
      if (merged.inStock) search.set('in_stock', '1');
      setParams(search);
      if (scroll) scrollToProducts();
    },
    // filters is derived from params each render
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [params, setParams],
  );

  return (
    <CartProvider>
      <StoreHeader searchQuery={filters.q} onSearch={(q) => update({ q })}>
        <CategoryNav activeCategory={filters.category} onSelect={(category) => update({ category })} />
      </StoreHeader>
      <main className="container">
        <HeroBanner />
        <TrustStrip />
        <CategoryGrid activeCategory={filters.category} onSelect={(category) => update({ category })} />
        <ProductCatalog
          products={products}
          total={total}
          loading={loading}
          error={error}
          hasMore={hasMore}
          searchQuery={filters.q}
          category={filters.category}
          sort={filters.sort}
          inStockOnly={filters.inStock}
          onSortChange={(sort) => update({ sort }, false)}
          onInStockChange={(inStock) => update({ inStock }, false)}
          onLoadMore={loadMore}
          onRetry={reload}
          onClearFilters={() => update({ q: '', category: '', sort: 'newest', inStock: false })}
        />
        <WhatsAppBand />
        <VisitStore />
      </main>
      <StoreFooter />
      <CartDrawer />
      <MobileCartBar />
    </CartProvider>
  );
}
