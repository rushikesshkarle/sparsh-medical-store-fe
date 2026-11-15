import Icon from '../Icon/Icon';
import { STORE_INFO } from '../../config/store';
import { isStoreOpen } from '../../utils/storeHours';
import './VisitStore.css';

export default function VisitStore() {
  const open = isStoreOpen();
  const { map } = STORE_INFO;
  const mapSrc =
    map.embedUrl ||
    `https://www.google.com/maps?q=${encodeURIComponent(map.query)}&z=${map.zoom}&output=embed`;

  return (
    <section className="visit" id="contact" aria-labelledby="visit-title">
      <div className="visit__card">
        <h2 id="visit-title">Visit the store</h2>
        <div className="visit__row">
          <span className="visit__icon">
            <Icon name="pin" />
          </span>
          <div>
            <strong>Address</strong>
            <span className="visit__value">{STORE_INFO.address}</span>
          </div>
        </div>
        <div className="visit__row">
          <span className="visit__icon">
            <Icon name="clock" />
          </span>
          <div>
            <strong>Opening hours</strong>
            <span className="visit__value">{STORE_INFO.hours.label}, every day</span>
            <span className={`visit__open${open ? '' : ' visit__open--closed'}`}>
              <span className={`status-dot${open ? '' : ' status-dot--closed'}`} aria-hidden="true" />
              {open ? 'Open now' : 'Closed now'}
            </span>
          </div>
        </div>
        <div className="visit__row">
          <span className="visit__icon">
            <Icon name="phone" />
          </span>
          <div>
            <strong>Phone</strong>
            <a className="visit__value" href={`tel:${STORE_INFO.phone}`}>
              {STORE_INFO.phoneDisplay}
            </a>
          </div>
        </div>
        <div className="visit__actions">
          <a className="btn btn--primary" href={STORE_INFO.mapsUrl} target="_blank" rel="noopener noreferrer">
            <Icon name="navigation" /> Get directions
          </a>
          <a className="btn btn--outline" href={`tel:${STORE_INFO.phone}`}>
            <Icon name="phone" /> Call store
          </a>
        </div>
      </div>
      <div className="visit__map">
        <iframe
          title={`Map showing ${STORE_INFO.name}`}
          src={mapSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
}
