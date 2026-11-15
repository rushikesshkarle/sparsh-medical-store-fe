import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../../components/Icon/Icon';
import { STORE_INFO } from '../../config/store';
import { isStoreOpen } from '../../utils/storeHours';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import { extractErrorMessage } from '../../services/api';
import '../../components/ProductForm/ProductForm.css';
import './LoginPage.css';

const ADMIN_HOME = '/admin/products';

/** Admin sign-in (username/password from the server env). Customers never sign in — they shop as guests. */
export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? ADMIN_HOME;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (isAuthenticated) return <Navigate to={from} replace />;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      login(await authService.login(username.trim(), password));
      navigate(from, { replace: true });
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
              <Icon name="chat" /> Order on WhatsApp, ready for pickup
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

          <h1>Admin sign in</h1>
          <p className="login-page__lead">Store staff only — manage the {STORE_INFO.name} catalogue.</p>

          <form className="login-page__fields" onSubmit={handleSubmit}>
            {error && (
              <div className="form-alert" role="alert">
                {error}
              </div>
            )}
            <label className="form-field">
              <span>Username</span>
              <input
                autoComplete="username"
                value={username}
                required
                maxLength={150}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
            <label className="form-field">
              <span>Password</span>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                required
                maxLength={256}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <button type="submit" className="btn btn--primary btn--block" disabled={busy}>
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="login-page__or" role="separator">
            <span>or</span>
          </div>

          <Link to="/" className="login-page__guest">
            <Icon name="store" /> Back to the store <Icon name="arrowRight" size={18} />
          </Link>
          <p className="login-page__hint">Shopping? No account needed — browse products and order on WhatsApp.</p>
        </div>
      </main>
    </div>
  );
}
