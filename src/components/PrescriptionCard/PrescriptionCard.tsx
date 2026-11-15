import Icon, { type IconName } from '../Icon/Icon';
import { STORE_INFO } from '../../config/store';
import { prescriptionUrl } from '../../utils/whatsapp';
import './PrescriptionCard.css';

const STEPS: { icon: IconName; title: string; text: string }[] = [
  { icon: 'camera', title: 'Snap your prescription', text: "A clear photo of the doctor's slip" },
  { icon: 'chat', title: 'Send it on WhatsApp', text: `To ${STORE_INFO.phoneDisplay}` },
  { icon: 'check', title: 'We confirm price & stock', text: "Pick up when it's ready" },
];

export default function PrescriptionCard() {
  return (
    <aside className="rx-card" aria-labelledby="rx-card-title">
      <span className="rx-card__tag">HAVE A PRESCRIPTION?</span>
      <h2 id="rx-card-title">Order in 3 easy steps</h2>
      <p className="rx-card__lead">No typing medicine names. Just send a photo.</p>
      <ol className="rx-card__steps">
        {STEPS.map((step) => (
          <li key={step.title}>
            <span className="rx-card__step-icon">
              <Icon name={step.icon} />
            </span>
            <span>
              <strong>{step.title}</strong>
              <span>{step.text}</span>
            </span>
          </li>
        ))}
      </ol>
      <a className="btn btn--wa btn--block" href={prescriptionUrl()} target="_blank" rel="noopener noreferrer">
        <Icon name="chat" /> Send prescription
      </a>
      <p className="rx-card__note">We reply during store hours, {STORE_INFO.hours.label}</p>
    </aside>
  );
}
