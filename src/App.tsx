import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AdminRoute from './components/AdminRoute/AdminRoute';
import StorePage from './pages/StorePage/StorePage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import LoginPage from './pages/LoginPage/LoginPage';
import PrivacyPage from './pages/PrivacyPage/PrivacyPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminProductFormPage from './pages/admin/AdminProductFormPage';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public storefront */}
          <Route path="/" element={<StorePage />} />

          {/* Google sign-in for everyone; admins are ALLOWED_ADMIN_EMAILS on the backend */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />

          {/* Admin (replaces the Django admin) */}
          <Route path="/admin/login" element={<Navigate to="/login" replace />} />
          <Route path="/admin" element={<Navigate to="/admin/products" replace />} />
          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <AdminProductsPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/products/new"
            element={
              <AdminRoute>
                <AdminProductFormPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/products/:id/edit"
            element={
              <AdminRoute>
                <AdminProductFormPage />
              </AdminRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
