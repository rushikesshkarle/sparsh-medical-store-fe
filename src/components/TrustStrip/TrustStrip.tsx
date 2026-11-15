import Icon, { type IconName } from '../Icon/Icon';
import './TrustStrip.css';

const ITEMS: { icon: IconName; title: string; text: string }[] = [
  { icon: 'shield', title: '100% genuine', text: 'Sourced from licensed distributors' },
  { icon: 'clock', title: 'Open till 11:30 PM', text: 'Every day, including Sundays' },
  { icon: 'user', title: 'Pharmacist advice', text: 'Ask before you buy' },
  { icon: 'chat', title: 'WhatsApp ordering', text: 'No app, no sign-up' },
];

export default function TrustStrip() {
  return (
    <ul className="trust" aria-label="Why shop with us">
      {ITEMS.map((item) => (
        <li key={item.title}>
          <span className="trust__icon">
            <Icon name={item.icon} />
          </span>
          <span>
            <strong>{item.title}</strong>
            <span className="trust__text">{item.text}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
