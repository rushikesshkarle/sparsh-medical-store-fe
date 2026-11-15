import Icon from '../Icon/Icon';
import { useCart } from '../../contexts/CartContext';
import { formatPrice } from '../../utils/format';
import './MobileCartBar.css';

/** Sticky cart summary on phones; hidden on wider screens and when the cart is empty. */
export default function MobileCartBar() {
  const { count, total, open, isOpen } = useCart();
  if (count === 0 || isOpen) return null;
  return (
    <div className="cart-bar">
      <div>
        <strong>
          {count} {count === 1 ? 'item' : 'items'} · {formatPrice(total)}
        </strong>
        <span>Order on WhatsApp</span>
      </div>
      <button type="button" className="btn btn--white" onClick={open}>
        View cart <Icon name="arrowRight" />
      </button>
    </div>
  );
}
