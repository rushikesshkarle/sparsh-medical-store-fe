import { Link } from 'react-router-dom';
import Icon from '../../components/Icon/Icon';
import { STORE_INFO } from '../../config/store';
import './PrivacyPage.css';

const LAST_UPDATED = '15 November 2026';

/** Privacy policy — linked from the footer and from the Google OAuth consent screen. */
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
          website and how it is used. You can browse products and place orders on WhatsApp without an account.
        </p>

        <h2>Information we collect</h2>
        <ul>
          <li>
            <strong>Google sign-in (optional):</strong> when you choose “Continue with Google”, we receive your name,
            email address and profile photo from Google. We do not receive your Google password.
          </li>
          <li>
            <strong>Your cart:</strong> the products and quantities in your cart. Guests’ carts stay only in their
            browser; a signed-in user’s cart is saved to their account.
          </li>
          <li>
            <strong>Orders:</strong> orders are sent to the store on WhatsApp. What you share there is handled by
            WhatsApp under its own privacy policy.
          </li>
        </ul>

        <h2>How we use it</h2>
        <ul>
          <li>To sign you in and keep your cart across devices.</li>
          <li>To let store staff manage the product catalogue.</li>
        </ul>
        <p>We do not sell your information, show ads, or share it with anyone except the services that run this site.</p>

        <h2>Services that process your data</h2>
        <ul>
          <li>Google — sign-in.</li>
          <li>MongoDB Atlas — stores accounts, carts and products.</li>
          <li>Render and Vercel — host the website.</li>
          <li>Cloudinary — stores product photos (no personal data).</li>
        </ul>

        <h2>Keeping and deleting your data</h2>
        <p>
          We keep your account and cart until you ask us to delete them. To have your data deleted, call or WhatsApp
          the store on <a href={`tel:${STORE_INFO.phone}`}>{STORE_INFO.phoneDisplay}</a> from your registered details,
          and we will remove it.
        </p>

        <h2>Changes</h2>
        <p>If this policy changes, the new version will be posted on this page with a new date.</p>
      </div>
    </main>
  );
}
