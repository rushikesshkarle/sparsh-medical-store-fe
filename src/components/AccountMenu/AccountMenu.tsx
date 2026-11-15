import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../Icon/Icon';
import { useAuth } from '../../contexts/AuthContext';
import './AccountMenu.css';

/** Header account control: "Sign in" when signed out; avatar menu when signed in.
 * "Admin dashboard" is shown only to admins (ALLOWED_ADMIN_EMAILS on the backend). */
export default function AccountMenu() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!isAuthenticated || !user) {
    return (
      <Link to="/login" className="account-menu__signin">
        <Icon name="user" />
        <span className="account-menu__signin-label">Sign in</span>
      </Link>
    );
  }

  const displayName = user.name || user.email;

  return (
    <div className="account-menu" ref={rootRef}>
      <button
        type="button"
        className="account-menu__trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Account menu for ${displayName}`}
        onClick={() => setOpen((v) => !v)}
      >
        {user.picture ? (
          <img src={user.picture} alt="" width={36} height={36} referrerPolicy="no-referrer" />
        ) : (
          <span className="account-menu__initial" aria-hidden="true">
            {displayName.charAt(0).toUpperCase()}
          </span>
        )}
      </button>

      {open && (
        <div className="account-menu__panel" role="menu">
          <div className="account-menu__who">
            <strong>{displayName}</strong>
            <small>{user.email}</small>
          </div>
          {isAdmin && (
            <Link to="/admin/products" className="account-menu__item" role="menuitem" onClick={() => setOpen(false)}>
              <Icon name="box" size={18} /> Admin dashboard
            </Link>
          )}
          <button
            type="button"
            className="account-menu__item"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              logout();
            }}
          >
            <Icon name="logout" size={18} /> Log out
          </button>
        </div>
      )}
    </div>
  );
}
