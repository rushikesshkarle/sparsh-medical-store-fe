import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout/AdminLayout';
import AdminStats from '../../components/AdminStats/AdminStats';
import Icon from '../../components/Icon/Icon';
import Loader from '../../components/Loader/Loader';
import { LOW_STOCK_THRESHOLD } from '../../config/store';
import { useProducts } from '../../hooks/useProducts';
import { productService } from '../../services/productService';
import { extractErrorMessage } from '../../services/api';
import { categoryVisual } from '../../utils/categoryVisual';
import { formatPrice } from '../../utils/format';
import { resolveMediaUrl } from '../../utils/media';
import type { Product, ProductStats, ProductStatus } from '../../types/product';
import './AdminProductsPage.css';

const TABS: { value: ProductStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'live', label: 'Live' },
  { value: 'hidden', label: 'Hidden' },
  { value: 'low_stock', label: 'Low stock' },
];

export default function AdminProductsPage() {
  const [draft, setDraft] = useState('');
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<ProductStatus>('all');
  const { products, total, loading, error, hasMore, loadMore, reload } = useProducts(
    { q, status },
    { admin: true, pageSize: 50 },
  );
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadStats = useCallback(() => {
    productService
      .stats()
      .then(setStats)
      .catch(() => setStats(null));
  }, []);
  useEffect(loadStats, [loadStats]);

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    setQ(draft.trim());
  };

  const runAction = async (product: Product, action: () => Promise<unknown>) => {
    setBusyId(product.id);
    setActionError(null);
    try {
      await action();
      reload();
      loadStats();
    } catch (err) {
      setActionError(extractErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = (product: Product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    void runAction(product, () => productService.remove(product.id));
  };

  /** Out of stock ⇄ in stock. Turning a product back on with 0 stock asks how many came in. */
  const toggleStock = (product: Product) => {
    if (product.in_stock) {
      void runAction(product, () => productService.update(product.id, { is_out_of_stock: true }));
      return;
    }
    if (product.stock > 0) {
      void runAction(product, () => productService.update(product.id, { is_out_of_stock: false }));
      return;
    }
    const answer = window.prompt(`How many "${product.name}" are in stock now?`, '10');
    if (answer === null) return;
    const qty = answer.trim();
    if (!/^[1-9]\d*$/.test(qty)) {
      setActionError('Enter a whole number greater than 0 to mark it in stock.');
      return;
    }
    void runAction(product, () => productService.update(product.id, { is_out_of_stock: false, stock: qty }));
  };

  const toggleAvailable = (product: Product) =>
    void runAction(product, () => productService.update(product.id, { is_available: !product.is_available }));

  return (
    <AdminLayout
      title="Products"
      subtitle="Manage what customers see on the store."
      actions={
        <Link to="/admin/products/new" className="btn btn--primary">
          <Icon name="plus" /> Add product
        </Link>
      }
    >
      <AdminStats stats={stats} />

      <div className="admin-panel">
        <div className="admin-panel__toolbar">
          <form className="admin-panel__search" role="search" onSubmit={handleSearch}>
            <Icon name="search" />
            <label htmlFor="admin-search" className="sr-only">
              Search products
            </label>
            <input
              id="admin-search"
              type="search"
              placeholder="Search by name, description or category"
              value={draft}
              maxLength={100}
              onChange={(e) => setDraft(e.target.value)}
            />
          </form>
          <div className="admin-panel__tabs" role="group" aria-label="Filter by status">
            {TABS.map((tab) => (
              <button
                type="button"
                key={tab.value}
                aria-pressed={status === tab.value}
                onClick={() => setStatus(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <span className="admin-panel__count">{loading ? 'Loading…' : `Showing ${products.length} of ${total}`}</span>
        </div>

        {(error || actionError) && (
          <div className="form-alert admin-panel__alert" role="alert">
            {error ?? actionError}
          </div>
        )}

        {loading && products.length === 0 ? (
          <Loader />
        ) : products.length === 0 ? (
          <p className="admin-panel__empty">
            {q || status !== 'all' ? 'No products match this filter.' : 'No products yet. Add the first one.'}
          </p>
        ) : (
          <div className="admin-panel__table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th scope="col">Product</th>
                  <th scope="col">Category</th>
                  <th scope="col">Price</th>
                  <th scope="col">Stock</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="admin-table__actions-head">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const img = resolveMediaUrl(p.image_url);
                  const visual = categoryVisual(p.category);
                  const stockClass = !p.in_stock
                    ? 'admin-table__stock--out'
                    : p.stock <= LOW_STOCK_THRESHOLD
                      ? 'admin-table__stock--low'
                      : '';
                  const stockNote = p.is_out_of_stock
                    ? 'marked out'
                    : p.stock === 0
                      ? 'none left'
                      : p.stock <= LOW_STOCK_THRESHOLD
                        ? 'low'
                        : '';
                  return (
                    <tr key={p.id}>
                      <td>
                        <div className="admin-table__product">
                          {img ? (
                            <img src={img} alt="" className="admin-table__thumb" />
                          ) : (
                            <span className={`admin-table__thumb tone-${visual.tone}`}>
                              <Icon name={visual.icon} />
                            </span>
                          )}
                          <span>
                            <strong>{p.name}</strong>
                            <span>{p.description || '—'}</span>
                          </span>
                        </div>
                      </td>
                      <td>{p.category ? <span className="admin-table__chip">{p.category}</span> : '—'}</td>
                      <td className="admin-table__price">{formatPrice(p.price)}</td>
                      <td>
                        <div className="admin-table__stock-cell">
                          <button
                            type="button"
                            role="switch"
                            aria-checked={p.in_stock}
                            className={`stock-switch${p.in_stock ? ' is-on' : ''}`}
                            disabled={busyId === p.id}
                            onClick={() => toggleStock(p)}
                            aria-label={`${p.name}: ${p.in_stock ? 'in stock — click to mark out of stock' : 'out of stock — click to mark in stock'}`}
                          >
                            <span className="stock-switch__track" aria-hidden="true">
                              <span className="stock-switch__thumb" />
                            </span>
                            <span className="stock-switch__label">{p.in_stock ? 'In stock' : 'Out of stock'}</span>
                          </button>
                          <span className={`admin-table__stock ${stockClass}`}>
                            {p.stock}
                            {stockNote && <small> · {stockNote}</small>}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className={`admin-table__status ${p.is_available ? 'is-live' : 'is-hidden'}`}>
                          <i aria-hidden="true" />
                          {p.is_available ? 'Live' : 'Hidden'}
                        </span>
                      </td>
                      <td>
                        <div className="admin-table__actions">
                          <Link
                            to={`/admin/products/${p.id}/edit`}
                            className="admin-table__icon-btn"
                            aria-label={`Edit ${p.name}`}
                            title="Edit"
                          >
                            <Icon name="edit" size={17} />
                          </Link>
                          <button
                            type="button"
                            className="admin-table__icon-btn"
                            disabled={busyId === p.id}
                            onClick={() => toggleAvailable(p)}
                            aria-label={`${p.is_available ? 'Hide' : 'Show'} ${p.name}`}
                            title={p.is_available ? 'Hide from store' : 'Show on store'}
                          >
                            <Icon name={p.is_available ? 'eyeOff' : 'eye'} size={17} />
                          </button>
                          <button
                            type="button"
                            className="admin-table__icon-btn admin-table__icon-btn--danger"
                            disabled={busyId === p.id}
                            onClick={() => handleDelete(p)}
                            aria-label={`Delete ${p.name}`}
                            title="Delete"
                          >
                            <Icon name="trash" size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {hasMore && (
        <div className="admin-panel__more">
          <button type="button" className="btn btn--subtle" onClick={loadMore} disabled={loading}>
            {loading ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}
    </AdminLayout>
  );
}
