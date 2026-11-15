import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout/AdminLayout';
import Loader from '../../components/Loader/Loader';
import ProductForm from '../../components/ProductForm/ProductForm';
import { productService } from '../../services/productService';
import { extractErrorMessage } from '../../services/api';
import type { Product, ProductInput } from '../../types/product';

/** Only the fields that changed are sent on update (the API applies a partial update). */
const diff = (original: Product, input: ProductInput): Partial<ProductInput> => {
  const changes: Partial<ProductInput> = {};
  if (input.name.trim() !== original.name) changes.name = input.name;
  if (input.description.trim() !== original.description) changes.description = input.description;
  if (Number(input.price) !== original.price) changes.price = input.price;
  if (Number(input.stock) !== original.stock) changes.stock = input.stock;
  if (input.category.trim() !== original.category) changes.category = input.category;
  if (input.is_available !== original.is_available) changes.is_available = input.is_available;
  if (input.is_out_of_stock !== original.is_out_of_stock) changes.is_out_of_stock = input.is_out_of_stock;
  if (input.image) changes.image = input.image;
  if (input.remove_image) changes.remove_image = true;
  return changes;
};

/** Create (/admin/products/new) or edit (/admin/products/:id/edit) a product. */
export default function AdminProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    let alive = true;
    productService
      .adminGet(id)
      .then((p) => alive && setProduct(p))
      .catch((err) => alive && setLoadError(extractErrorMessage(err)))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [id]);

  const handleSubmit = async (input: ProductInput) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      if (product) {
        const changes = diff(product, input);
        if (Object.keys(changes).length) await productService.update(product.id, changes);
      } else {
        await productService.create(input);
      }
      navigate('/admin/products');
    } catch (err) {
      setSubmitError(extractErrorMessage(err));
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout
      title={id ? 'Edit product' : 'Add product'}
      subtitle={id ? 'Changes appear on the store as soon as you save.' : 'New products go live on the store straight away unless you untick “Show on the store”.'}
    >
      {loading ? (
        <Loader />
      ) : loadError ? (
        <div className="form-alert" role="alert">
          {loadError}
        </div>
      ) : (
        <ProductForm
          initial={product ?? undefined}
          submitting={submitting}
          error={submitError}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/admin/products')}
        />
      )}
    </AdminLayout>
  );
}
