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
import type { Admin, LoginResult } from '../types/auth';

interface AuthContextValue {
  /** True when the store admin is signed in (there are no customer accounts). */
  isAuthenticated: boolean;
  admin: Admin | null;
  login: (result: LoginResult) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Hydrate synchronously from sessionStorage so there is no logged-out flash.
  const [token, setToken] = useState<string | null>(() => StorageService.getToken());
  const [admin, setAdmin] = useState<Admin | null>(() => StorageService.getAdmin());

  const login = useCallback((result: LoginResult) => {
    StorageService.setToken(result.access_token);
    StorageService.setAdmin(result.admin);
    setToken(result.access_token);
    setAdmin(result.admin);
  }, []);

  const logout = useCallback(() => {
    StorageService.clearSession();
    setToken(null);
    setAdmin(null);
  }, []);

  // Revalidate a stored token once on load; an expired one is dropped by the
  // 401 interceptor in services/api.ts.
  useEffect(() => {
    if (!token) return;
    let alive = true;
    authService
      .me()
      .then((fresh) => {
        if (!alive) return;
        StorageService.setAdmin(fresh);
        setAdmin(fresh);
      })
      .catch(() => {
        /* handled by the interceptor */
      });
    return () => {
      alive = false;
    };
    // Only on first mount — login() already stores a fresh admin.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated: Boolean(token && admin), admin, login, logout }),
    [token, admin, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
