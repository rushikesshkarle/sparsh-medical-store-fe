import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import Icon from '../../components/Icon/Icon';
import { STORE_INFO } from '../../config/store';
import { isStoreOpen } from '../../utils/storeHours';
import { GOOGLE_CLIENT_ID } from '../../config/googleAuth';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import { extractErrorMessage } from '../../services/api';
import type { User } from '../../types/auth';
import '../../components/ProductForm/ProductForm.css';
import './LoginPage.css';

const ADMIN_HOME = '/admin/products';

/** Where to land after sign-in: back where a guard bounced you from, else admins → dashboard, customers → store. */
function landingFor(user: User, from: string | undefined): string {
  if (from && (!from.startsWith('/admin') || user.is_admin)) return from;
  return user.is_admin ? ADMIN_HOME : '/';
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

/** Our own button opens Google's popup (auth-code flow); the backend exchanges the code. Must sit under GoogleOAuthProvider. */
function GoogleSignInButton({ busy, onCode, onError }: { busy: boolean; onCode: (code: string) => void; onError: () => void }) {
  const openPopup = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: (response) => onCode(response.code),
    onError,
    onNonOAuthError: (err) => {
      // Closing the popup is not an error worth shouting about.
      if (err.type !== 'popup_closed') onError();
    },
  });
  return (
    <button type="button" className="login-page__google" disabled={busy} onClick={() => openPopup()}>
      <GoogleIcon />
      {busy ? 'Signing in…' : 'Continue with Google'}
    </button>
  );
}

/** One sign-in page for everyone. The backend decides admin vs customer (ALLOWED_ADMIN_EMAILS). */
export default function LoginPage() {
  const { isAuthenticated, user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname;

  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (isAuthenticated && user) return <Navigate to={landingFor(user, from)} replace />;

  const handleCode = async (code: string) => {
    setBusy(true);
    setError(null);
    try {
      const result = await authService.googleLogin(code);
      login(result);
      navigate(landingFor(result.user, from), { replace: true });
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const open = isStoreOpen();

  return (
    <div className="login-page">
      {/* ── Brand panel (hidden on small screens) ── */}
      <aside className="login-page__aside" aria-hidden="true">
        <div className="login-page__brand">
          <img src={STORE_INFO.logo} alt="" width={44} height={44} />
          <span>
            <strong>{STORE_INFO.name}</strong>
            <small>{STORE_INFO.tagline}</small>
          </span>
        </div>

        <div className="login-page__pitch">
          <h2>Your neighbourhood chemist, now online.</h2>
          <p>
            Browse what's in stock, order on WhatsApp, and keep the store's catalogue up to date — all in one place.
          </p>
          <ul className="login-page__points">
            <li>
              <Icon name="shield" /> Genuine medicines from a trusted local store
            </li>
            <li>
              <Icon name="chat" /> Order and send prescriptions on WhatsApp
            </li>
            <li>
              <Icon name="box" /> Staff manage products, prices and stock
            </li>
          </ul>
        </div>

        <div className="login-page__store">
          <span className={`status-dot${open ? '' : ' status-dot--closed'}`} />
          <span>
            {open ? 'Open now' : 'Closed now'} · {STORE_INFO.hours.label}
          </span>
          <span className="login-page__store-sep" />
          <span>{STORE_INFO.locality}</span>
        </div>
      </aside>

      {/* ── Sign-in form ── */}
      <main className="login-page__main">
        <div className="login-page__form">
          <div className="login-page__mobile-brand">
            <img src={STORE_INFO.logo} alt="" width={48} height={48} />
            <strong>{STORE_INFO.name}</strong>
          </div>

          <h1>Sign in</h1>
          <p className="login-page__lead">Use your Google account to continue to {STORE_INFO.name}.</p>

          {error && (
            <div className="form-alert" role="alert">
              {error}
            </div>
          )}

          {GOOGLE_CLIENT_ID ? (
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
              <GoogleSignInButton
                busy={busy}
                onCode={handleCode}
                onError={() => setError('Google sign-in failed. Please try again.')}
              />
            </GoogleOAuthProvider>
          ) : (
            <>
              <button type="button" className="login-page__google" disabled>
                <GoogleIcon /> Continue with Google
              </button>
              <p className="login-page__note">Google sign-in is not configured (set VITE_GOOGLE_CLIENT_ID).</p>
            </>
          )}

          <div className="login-page__or" role="separator">
            <span>or</span>
          </div>

          <Link to="/" className="login-page__guest">
            <Icon name="user" /> Continue as guest <Icon name="arrowRight" size={18} />
          </Link>
          <p className="login-page__hint">
            No account needed — browse products and order on WhatsApp.
          </p>

          <p className="login-page__staff">Store staff: sign in with Google to open the admin dashboard.</p>
        </div>
      </main>
    </div>
  );
}
