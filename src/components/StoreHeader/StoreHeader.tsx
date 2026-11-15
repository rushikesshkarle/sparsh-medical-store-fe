import { useState, type FormEvent, type ReactNode } from 'react';
import Icon from '../Icon/Icon';
import AccountMenu from '../AccountMenu/AccountMenu';
import { STORE_INFO } from '../../config/store';
import { useCart } from '../../contexts/CartContext';
import { prescriptionUrl } from '../../utils/whatsapp';
import './StoreHeader.css';

interface StoreHeaderProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  children?: ReactNode; // category navigation, rendered inside the sticky header
}

export default function StoreHeader({ searchQuery, onSearch, children }: StoreHeaderProps) {
  const { count, open } = useCart();
  const [draft, setDraft] = useState(searchQuery);
  // Keep the box in sync when the query changes from outside (back button, "Clear").
  const [lastQuery, setLastQuery] = useState(searchQuery);
  if (searchQuery !== lastQuery) {
    setLastQuery(searchQuery);
    setDraft(searchQuery);
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSearch(draft.trim());
  };

  return (
    <header className="store-header">
      <div className="container store-header__row">
        <a href="#home" className="store-header__brand" aria-label={`${STORE_INFO.name} home`}>
          <img src={STORE_INFO.logo} alt="" width={44} height={44} />
          <span>
            <strong>{STORE_INFO.name}</strong>
            <small>{STORE_INFO.tagline}</small>
          </span>
        </a>

        <form className="store-header__search" role="search" onSubmit={handleSubmit}>
          <Icon name="search" />
          <label htmlFor="store-search" className="sr-only">
            Search products
          </label>
          <input
            id="store-search"
            type="search"
            placeholder="Search medicines, vitamins, personal care…"
            value={draft}
            maxLength={100}
            onChange={(e) => setDraft(e.target.value)}
          />
          <button type="submit" className="btn btn--primary store-header__search-btn">
            Search
          </button>
        </form>

        <div className="store-header__actions">
          <a className="store-header__call" href={`tel:${STORE_INFO.phone}`} aria-label={`Call the store, ${STORE_INFO.phoneDisplay}`}>
            <Icon name="phone" />
            <span className="store-header__call-text">
              <small>Call the store</small>
              {STORE_INFO.phoneDisplay}
            </span>
          </a>
          <a className="store-header__rx" href={prescriptionUrl()} target="_blank" rel="noopener noreferrer">
            <Icon name="file" /> Upload prescription
          </a>
          <button type="button" className="store-header__cart" onClick={open} aria-label={`Open cart, ${count} items`}>
            <Icon name="cart" />
            <span className="store-header__cart-label">Cart</span>
            {count > 0 && (
              <span className="store-header__badge" aria-hidden="true">
                {count}
              </span>
            )}
          </button>
          <AccountMenu />
        </div>
      </div>
      {children}
    </header>
  );
}
