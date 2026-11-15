import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { StorageService } from '../utils/StorageUtils';
import { authService } from '../services/authService';
import type { LoginResult, User } from '../types/auth';

interface AuthContextValue {
  isAuthenticated: boolean;
  /** True only for emails in the backend's ALLOWED_ADMIN_EMAILS. */
  isAdmin: boolean;
  user: User | null;
  login: (result: LoginResult) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Hydrate synchronously from sessionStorage so there is no logged-out flash.
  const [token, setToken] = useState<string | null>(() => StorageService.getToken());
  const [user, setUser] = useState<User | null>(() => StorageService.getUser());

  const login = useCallback((result: LoginResult) => {
    StorageService.setToken(result.access_token);
    StorageService.setUser(result.user);
    setToken(result.access_token);
    setUser(result.user);
  }, []);

  const logout = useCallback(() => {
    StorageService.clearSession();
    // The cart is saved on the account; don't leave it on a shared device.
    StorageService.setCart([]);
    setToken(null);
    setUser(null);
  }, []);

  // Revalidate a stored token once on load, which also refreshes is_admin if the
  // admin list changed. An expired token is dropped by the 401 interceptor.
  useEffect(() => {
    if (!token) return;
    let alive = true;
    authService
      .me()
      .then((fresh) => {
        if (!alive) return;
        StorageService.setUser(fresh);
        setUser(fresh);
      })
      .catch(() => {
        /* handled by the interceptor */
      });
    return () => {
      alive = false;
    };
    // Only on first mount — login() already stores a fresh user.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(token && user),
      isAdmin: Boolean(token && user?.is_admin),
      user,
      login,
      logout,
    }),
    [token, user, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
