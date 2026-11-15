import type { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Icon from '../Icon/Icon';
import { STORE_INFO } from '../../config/store';
import { useAuth } from '../../contexts/AuthContext';
import './AdminLayout.css';

interface AdminLayoutProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export default function AdminLayout({ title, subtitle, actions, children }: AdminLayoutProps) {
  const { admin, logout } = useAuth();
  const displayName = admin?.username ?? '';
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <div className="admin-side__brand">
          <img src={STORE_INFO.logo} alt="" width={40} height={40} />
          <span>
            <strong>{STORE_INFO.name}</strong>
            <small>Store admin</small>
          </span>
        </div>
        <nav className="admin-side__nav" aria-label="Admin">
          <NavLink to="/admin/products" end className="admin-side__link">
            <Icon name="box" /> Products
          </NavLink>
          <NavLink to="/admin/products/new" className="admin-side__link">
            <Icon name="plus" /> Add product
          </NavLink>
          <a href="/" target="_blank" rel="noopener noreferrer" className="admin-side__link">
            <Icon name="store" /> View store
          </a>
        </nav>
        <div className="admin-side__me">
          <span className="admin-side__avatar" aria-hidden="true">
            {displayName.charAt(0).toUpperCase()}
          </span>
          <span className="admin-side__who">
            <strong>{displayName}</strong>
            <small>Store manager</small>
          </span>
          <button type="button" className="admin-side__logout" onClick={handleLogout} aria-label="Log out">
            <Icon name="logout" />
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-main__head">
          <div>
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          {actions}
        </div>
        {children}
      </main>
    </div>
  );
}
