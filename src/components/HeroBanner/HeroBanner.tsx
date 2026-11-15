import Icon from '../Icon/Icon';
import PrescriptionCard from '../PrescriptionCard/PrescriptionCard';
import { STORE_INFO } from '../../config/store';
import { hoursOpenPerDay, isStoreOpen } from '../../utils/storeHours';
import { whatsappUrl } from '../../utils/whatsapp';
import './HeroBanner.css';

export default function HeroBanner() {
  const open = isStoreOpen();
  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <div className="hero__main">
        <p className="hero__status">
          <span className={`status-dot${open ? '' : ' status-dot--closed'}`} aria-hidden="true" />
          <strong>{open ? 'Open now' : 'Closed now'}</strong>
          <span>{open ? `until ${STORE_INFO.hours.closeLabel}` : `opens ${STORE_INFO.hours.openLabel}`}</span>
          <span className="hero__status-place">
            <span className="hero__status-sep" aria-hidden="true" />
            <Icon name="pin" size={15} />
            {STORE_INFO.locality}
          </span>
        </p>
        <h1 id="hero-title">Genuine medicines &amp; wellness, a message away.</h1>
        <p>
          Browse what's in stock at {STORE_INFO.name}, add to cart and send your order on WhatsApp. We confirm and keep
          it ready.
        </p>
        <div className="hero__cta">
          <a href="#products" className="btn btn--white">
            Shop products <Icon name="arrowRight" />
          </a>
          <a
            className="btn btn--ghost-light"
            href={whatsappUrl(`Hello ${STORE_INFO.name}, I'd like to place an order.`)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="chat" /> Order on WhatsApp
          </a>
        </div>
        <dl className="hero__stats">
          <div>
            <dt>{hoursOpenPerDay()} hrs</dt>
            <dd>open every day</dd>
          </div>
          <div>
            <dt>100%</dt>
            <dd>genuine products</dd>
          </div>
          <div>
            <dt>2 min</dt>
            <dd>to place an order</dd>
          </div>
        </dl>
      </div>
      <PrescriptionCard />
    </section>
  );
}
