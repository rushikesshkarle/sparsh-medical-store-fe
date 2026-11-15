import { useEffect, useRef } from 'react';
import Icon from '../Icon/Icon';
import { useCart } from '../../contexts/CartContext';
import { formatPrice } from '../../utils/format';
import { buildWhatsAppOrderUrl } from '../../utils/whatsapp';
import './CartDrawer.css';

/** Slide-in cart. "Order on WhatsApp" opens a chat with the store, pre-filled with the order. */
export default function CartDrawer() {
  const { items, total, count, isOpen, close, setQuantity, remove, clear } = useCart();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    <div className="cart-drawer__overlay" onClick={close}>
      <aside
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="cart-drawer__head">
          <h2 id="cart-title">
            Your cart {count > 0 && <span>({count})</span>}
          </h2>
          <button ref={closeRef} type="button" className="cart-drawer__close" onClick={close} aria-label="Close cart">
            <Icon name="x" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="cart-drawer__empty">
            <span className="cart-drawer__empty-icon">
              <Icon name="cart" size={32} />
            </span>
            <p>Your cart is empty.</p>
            <button type="button" className="btn btn--outline" onClick={close}>
              Browse products
            </button>
          </div>
        ) : (
          <>
            <ul className="cart-drawer__items">
              {items.map((item) => (
                <li key={item.id} className="cart-drawer__item">
                  <div className="cart-drawer__item-top">
                    <strong>{item.name}</strong>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                  <div className="cart-drawer__item-bottom">
                    <div className="cart-drawer__qty" role="group" aria-label={`${item.name} quantity`}>
                      <button
                        type="button"
                        onClick={() => setQuantity(item.id, item.quantity - 1)}
                        aria-label={`Decrease ${item.name}`}
                      >
                        <Icon name="minus" size={16} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(item.id, item.quantity + 1)}
                        aria-label={`Increase ${item.name}`}
                      >
                        <Icon name="plus" size={16} />
                      </button>
                    </div>
                    <span className="cart-drawer__unit">{formatPrice(item.price)} each</span>
                    <button type="button" className="cart-drawer__remove" onClick={() => remove(item.id)}>
                      <Icon name="trash" size={16} /> Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="cart-drawer__foot">
              <div className="cart-drawer__total">
                <span>Total</span>
                <strong>{formatPrice(total)}</strong>
              </div>
              <a
                className="btn btn--wa btn--block"
                href={buildWhatsAppOrderUrl(items)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="chat" /> Order on WhatsApp
              </a>
              <button type="button" className="cart-drawer__clear" onClick={clear}>
                Clear cart
              </button>
              <p className="cart-drawer__note">We reply on WhatsApp to confirm your order and tell you when it’s ready to pick up.</p>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
