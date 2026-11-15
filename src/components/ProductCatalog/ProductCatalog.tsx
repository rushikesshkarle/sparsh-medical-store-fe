import Icon from '../Icon/Icon';
import Loader from '../Loader/Loader';
import ProductCard from '../ProductCard/ProductCard';
import type { Product, ProductSort } from '../../types/product';
import './ProductCatalog.css';

const SORTS: { value: ProductSort; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
];

interface ProductCatalogProps {
  products: Product[];
  total: number;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  searchQuery: string;
  category: string;
  sort: ProductSort;
  inStockOnly: boolean;
  onSortChange: (sort: ProductSort) => void;
  onInStockChange: (value: boolean) => void;
  onLoadMore: () => void;
  onRetry: () => void;
  onClearFilters: () => void;
}

export default function ProductCatalog(props: ProductCatalogProps) {
  const { products, total, loading, error, hasMore, searchQuery, category, sort, inStockOnly } = props;
  const filtered = Boolean(searchQuery || category || inStockOnly);
  const firstLoad = loading && products.length === 0;
  const title = searchQuery ? `Results for “${searchQuery}”` : category || 'Popular at Sparsh';

  return (
    <section className="catalog" id="products" aria-labelledby="catalog-title">
      <div className="section-head">
        <div>
          <h2 id="catalog-title">{title}</h2>
          <p aria-live="polite">
            {loading ? 'Loading products…' : `Showing ${products.length} of ${total} products`}
            {searchQuery && category && ` in ${category}`}
            {filtered && (
              <button type="button" className="catalog__clear" onClick={props.onClearFilters}>
                Clear filters
              </button>
            )}
          </p>
        </div>
        <div className="catalog__filters" role="group" aria-label="Sort and filter">
          {SORTS.map((s) => (
            <button
              type="button"
              key={s.value}
              className="chip"
              aria-pressed={sort === s.value}
              onClick={() => props.onSortChange(s.value)}
            >
              {s.label}
            </button>
          ))}
          <button
            type="button"
            className="chip"
            aria-pressed={inStockOnly}
            onClick={() => props.onInStockChange(!inStockOnly)}
          >
            In stock only
          </button>
        </div>
      </div>

      {error ? (
        <div className="catalog__state">
          <Icon name="alert" size={36} />
          <h3>Could not load products</h3>
          <p>{error}</p>
          <button type="button" className="btn btn--primary" onClick={props.onRetry}>
            Try again
          </button>
        </div>
      ) : firstLoad ? (
        <Loader label="Loading products…" />
      ) : products.length === 0 ? (
        <div className="catalog__state">
          <Icon name="search" size={36} />
          <h3>No products found</h3>
          <p>{filtered ? 'Try a different name or category.' : 'Products will appear here soon.'}</p>
          {filtered && (
            <button type="button" className="btn btn--outline" onClick={props.onClearFilters}>
              View all products
            </button>
          )}
        </div>
      ) : (
        <div className="catalog__grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {!error && hasMore && (
        <div className="catalog__more">
          <button type="button" className="btn btn--outline" onClick={props.onLoadMore} disabled={loading}>
            {loading ? 'Loading…' : 'Load more products'}
          </button>
        </div>
      )}
    </section>
  );
}
