import { Link } from 'react-router-dom';
import { STORE_INFO } from '../../config/store';
import { whatsappUrl } from '../../utils/whatsapp';
import './StoreFooter.css';

export default function StoreFooter() {
  return (
    <footer className="store-footer">
      <div className="container">
        <div className="store-footer__grid">
          <div>
            <div className="store-footer__brand">
              <img src={STORE_INFO.logo} alt="" width={44} height={44} />
              <span>
                <strong>{STORE_INFO.name}</strong>
                <small>{STORE_INFO.tagline}</small>
              </span>
            </div>
            <p className="store-footer__about">
              Your trusted neighbourhood chemist for medicines, wellness and personal care.
            </p>
          </div>
          <nav aria-label="Shop">
            <h3>Shop</h3>
            <a href="#products">All products</a>
            <a href="#categories">Categories</a>
            <a href="#home">Home</a>
          </nav>
          <nav aria-label="Help">
            <h3>Help</h3>
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
              Order on WhatsApp
            </a>
            <a href={STORE_INFO.mapsUrl} target="_blank" rel="noopener noreferrer">
              Get directions
            </a>
          </nav>
          <div>
            <h3>Contact</h3>
            <p>{STORE_INFO.shortAddress}</p>
            <p>{STORE_INFO.hours.label}</p>
            <a href={`tel:${STORE_INFO.phone}`}>{STORE_INFO.phoneDisplay}</a>
          </div>
        </div>
        <div className="store-footer__bottom">
          <span>
            © {new Date().getFullYear()} {STORE_INFO.name}. All rights reserved.
          </span>
          <span>
            Orders are confirmed by the store on WhatsApp. · <Link to="/privacy">Privacy policy</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
