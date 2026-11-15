import { Link } from 'react-router-dom';
import Icon from '../../components/Icon/Icon';
import { STORE_INFO } from '../../config/store';
import './PrivacyPage.css';

const LAST_UPDATED = '15 November 2026';

/** Privacy policy — linked from the footer. */
export default function PrivacyPage() {
  return (
    <main className="privacy">
      <div className="privacy__inner">
        <Link to="/" className="privacy__back">
          <Icon name="store" size={16} /> Back to the store
        </Link>
        <h1>Privacy policy</h1>
        <p className="privacy__updated">Last updated: {LAST_UPDATED}</p>

        <p>
          This policy explains what information {STORE_INFO.name} ({STORE_INFO.address}) collects through this
          website and how it is used. There are no customer accounts: you browse products and place orders on WhatsApp.
        </p>

        <h2>Information we collect</h2>
        <ul>
          <li>
            <strong>No accounts, no sign-in:</strong> we don’t ask for your name, email, phone or password to use the
            site.
          </li>
          <li>
            <strong>Your cart:</strong> kept only in your own browser (local storage). It is never sent to or stored
            on our servers; clearing your browser data removes it.
          </li>
          <li>
            <strong>Orders:</strong> when you order, your cart is sent to the store on WhatsApp. What you share there
            is handled by WhatsApp under its own privacy policy.
          </li>
          <li>
            <strong>Store map:</strong> the “Visit the store” section shows an embedded Google Map, which Google may
            log under its own privacy policy.
          </li>
        </ul>

        <h2>How we use it</h2>
        <p>
          Only to show you the product catalogue and to receive your WhatsApp orders. We do not sell your information,
          show ads, or use tracking cookies.
        </p>

        <h2>Services that run this site</h2>
        <ul>
          <li>Render and Vercel — host the website.</li>
          <li>MongoDB Atlas — stores the product catalogue (no customer data).</li>
          <li>Cloudinary — stores product photos (no customer data).</li>
        </ul>

        <h2>Questions</h2>
        <p>
          Call or WhatsApp the store on <a href={`tel:${STORE_INFO.phone}`}>{STORE_INFO.phoneDisplay}</a>.
        </p>

        <h2>Changes</h2>
        <p>If this policy changes, the new version will be posted on this page with a new date.</p>
      </div>
    </main>
  );
}
