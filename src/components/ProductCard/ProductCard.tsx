import Icon from '../Icon/Icon';
import { LOW_STOCK_THRESHOLD } from '../../config/store';
import { useCart } from '../../contexts/CartContext';
import { categoryVisual } from '../../utils/categoryVisual';
import { formatPrice } from '../../utils/format';
import { resolveMediaUrl } from '../../utils/media';
import { notifyUrl } from '../../utils/whatsapp';
import type { Product } from '../../types/product';
import './ProductCard.css';

export default function ProductCard({ product }: { product: Product }) {
  const { add, quantityOf, setQuantity } = useCart();
  const image = resolveMediaUrl(product.image_url);
  const visual = categoryVisual(product.category);
  const quantity = quantityOf(product.id);
  const lowStock = product.in_stock && product.stock <= LOW_STOCK_THRESHOLD;

  return (
    <article className={`product-card${product.in_stock ? '' : ' product-card--out'}`}>
      <div className={`product-card__media ${image ? 'product-card__media--photo' : `tone-${visual.tone}`}`}>
        {image ? (
          <img src={image} alt={product.name} loading="lazy" />
        ) : (
          <Icon name={visual.icon} size={56} />
        )}
      </div>

      <span className="product-card__category">{product.category || 'Healthcare'}</span>
      <h3>{product.name}</h3>
      <p className="product-card__desc">{product.description || 'Available at Sparsh Medical.'}</p>

      {!product.in_stock ? (
        <span className="product-card__stock product-card__stock--out">Out of stock</span>
      ) : lowStock ? (
        <span className="product-card__stock product-card__stock--low">
          <Icon name="clock" size={14} /> Few left
        </span>
      ) : (
        <span className="product-card__stock">
          <Icon name="check" size={14} /> In stock
        </span>
      )}

      <div className="product-card__foot">
        <strong className="product-card__price">{formatPrice(product.price)}</strong>
        {!product.in_stock ? (
          <a className="product-card__notify" href={notifyUrl(product.name)} target="_blank" rel="noopener noreferrer">
            Notify me
          </a>
        ) : quantity > 0 ? (
          <div className="product-card__qty" role="group" aria-label={`${product.name} quantity`}>
            <button type="button" onClick={() => setQuantity(product.id, quantity - 1)} aria-label="Decrease quantity">
              <Icon name="minus" size={16} />
            </button>
            <span aria-live="polite">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(product.id, Math.min(quantity + 1, product.stock))}
              disabled={quantity >= product.stock}
              aria-label="Increase quantity"
            >
              <Icon name="plus" size={16} />
            </button>
          </div>
        ) : (
          <button type="button" className="product-card__add" onClick={() => add(product)}>
            ADD
          </button>
        )}
      </div>
    </article>
  );
}
