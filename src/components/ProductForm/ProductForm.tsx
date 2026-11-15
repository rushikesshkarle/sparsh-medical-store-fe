import { useEffect, useMemo, useState, type FormEvent } from 'react';
import Icon from '../Icon/Icon';
import { CATEGORIES } from '../../config/store';
import { resolveMediaUrl } from '../../utils/media';
import type { Product, ProductInput } from '../../types/product';
import './ProductForm.css';

const MAX_IMAGE_MB = 5;
const ACCEPTED_TYPES = 'image/jpeg,image/png,image/webp,image/gif';

interface ProductFormProps {
  initial?: Product;
  submitting: boolean;
  error: string | null;
  onSubmit: (input: ProductInput) => void;
  onCancel: () => void;
}

const toInput = (p?: Product): ProductInput => ({
  name: p?.name ?? '',
  description: p?.description ?? '',
  price: p ? (Number.isInteger(p.price) ? String(p.price) : p.price.toFixed(2)) : '',
  stock: p ? String(p.stock) : '0',
  category: p?.category ?? '',
  is_available: p?.is_available ?? true,
  is_out_of_stock: p?.is_out_of_stock ?? false,
  image: null,
  remove_image: false,
});

export default function ProductForm({ initial, submitting, error, onSubmit, onCancel }: ProductFormProps) {
  const [values, setValues] = useState<ProductInput>(() => toInput(initial));
  const [localError, setLocalError] = useState<string | null>(null);

  const previewUrl = useMemo(() => (values.image ? URL.createObjectURL(values.image) : null), [values.image]);
  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const currentImage = values.remove_image ? null : resolveMediaUrl(initial?.image_url ?? null);
  const shownImage = previewUrl ?? currentImage;

  const set = <K extends keyof ProductInput>(key: K, value: ProductInput[K]) =>
    setValues((v) => ({ ...v, [key]: value }));

  const handleFile = (file: File | null) => {
    setLocalError(null);
    if (file && file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setLocalError(`Image must be ${MAX_IMAGE_MB} MB or smaller.`);
      return;
    }
    setValues((v) => ({ ...v, image: file, remove_image: false }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setLocalError(null);
    if (!values.name.trim()) return setLocalError('Name is required.');
    if (!/^\d+(\.\d{1,2})?$/.test(values.price.trim())) {
      return setLocalError('Price must be a number with at most 2 decimals, e.g. 199 or 249.50.');
    }
    if (!/^\d+$/.test(values.stock.trim())) return setLocalError('Stock must be a whole number (0 or more).');
    onSubmit(values);
  };

  const message = localError ?? error;

  return (
    <form className="product-form" onSubmit={handleSubmit} noValidate>
      {message && (
        <div className="form-alert" role="alert">
          {message}
        </div>
      )}

      <label className="form-field">
        <span>Name *</span>
        <input value={values.name} maxLength={200} required onChange={(e) => set('name', e.target.value)} />
      </label>

      <div className="product-form__row">
        <label className="form-field">
          <span>Price (₹) *</span>
          <input
            inputMode="decimal"
            value={values.price}
            placeholder="199.00"
            required
            onChange={(e) => set('price', e.target.value)}
          />
        </label>
        <label className="form-field">
          <span>Stock</span>
          <input inputMode="numeric" value={values.stock} onChange={(e) => set('stock', e.target.value)} />
        </label>
      </div>

      <label className="form-field">
        <span>Category</span>
        <input
          list="category-suggestions"
          value={values.category}
          maxLength={100}
          placeholder="e.g. Vitamins"
          onChange={(e) => set('category', e.target.value)}
        />
        <datalist id="category-suggestions">
          {CATEGORIES.filter((c) => c.value).map((c) => (
            <option key={c.value} value={c.value} />
          ))}
        </datalist>
      </label>

      <label className="form-field">
        <span>Description</span>
        <textarea
          rows={4}
          value={values.description}
          maxLength={5000}
          onChange={(e) => set('description', e.target.value)}
        />
      </label>

      <div className="form-field">
        <span>Image</span>
        <div className="product-form__image">
          {shownImage ? (
            <img className="product-form__preview" src={shownImage} alt="Product preview" />
          ) : (
            <span className="product-form__preview product-form__preview--empty">
              <Icon name="image" size={32} />
            </span>
          )}
        </div>
        <input type="file" accept={ACCEPTED_TYPES} onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />
        {initial?.image_url && !values.image && (
          <label className="form-check">
            <input
              type="checkbox"
              checked={values.remove_image}
              onChange={(e) => set('remove_image', e.target.checked)}
            />
            Remove current image
          </label>
        )}
        <small>JPEG, PNG, WEBP or GIF, up to {MAX_IMAGE_MB} MB.</small>
      </div>

      <label className="form-check">
        <input
          type="checkbox"
          checked={values.is_out_of_stock}
          onChange={(e) => set('is_out_of_stock', e.target.checked)}
        />
        Mark as out of stock (keeps the stock number; customers see “Out of stock”)
      </label>

      <label className="form-check">
        <input type="checkbox" checked={values.is_available} onChange={(e) => set('is_available', e.target.checked)} />
        Show on the store (available)
      </label>

      <div className="product-form__actions">
        <button type="button" className="btn btn--subtle" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
        <button type="submit" className="btn btn--primary" disabled={submitting}>
          {submitting ? 'Saving…' : initial ? 'Save changes' : 'Create product'}
        </button>
      </div>
    </form>
  );
}
