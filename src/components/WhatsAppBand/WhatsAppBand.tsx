import Icon from '../Icon/Icon';
import { enquiryUrl } from '../../utils/whatsapp';
import './WhatsAppBand.css';

export default function WhatsAppBand() {
  return (
    <section className="wa-band" aria-labelledby="wa-band-title">
      <div className="wa-band__text">
        <span className="wa-band__icon">
          <Icon name="chat" size={32} />
        </span>
        <div>
          <h2 id="wa-band-title">Can't find a medicine?</h2>
          <p>Message us the name or a photo. If we don't have it, we'll try to arrange it for you.</p>
        </div>
      </div>
      <a className="btn wa-band__btn" href={enquiryUrl()} target="_blank" rel="noopener noreferrer">
        <Icon name="chat" /> Chat on WhatsApp
      </a>
    </section>
  );
}
