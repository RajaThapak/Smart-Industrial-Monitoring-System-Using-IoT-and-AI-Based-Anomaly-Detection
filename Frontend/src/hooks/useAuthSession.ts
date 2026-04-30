import { useCallback, useEffect, useState } from "react";

type AuthUser = {
  id: number;
  username: string;
  email: string;
};

type AuthState = {
  authenticated: boolean;
  loading: boolean;
  user: AuthUser | null;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const API_BASE = ""; // use relative paths so dev proxy can forward to backend

export function useAuthSession(): AuthState {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/auth/status/`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Unable to fetch auth status");
      }

      const result = await response.json();
      setAuthenticated(Boolean(result.authenticated));
      setUser(result.user ?? null);
    } catch {
      setAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await fetch(`${API_BASE}/api/auth/logout/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: "{}",
    });
    localStorage.removeItem("sims-user");
    sessionStorage.removeItem("sims-user");
    setAuthenticated(false);
    setUser(null);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { authenticated, loading, user, refresh, logout };
}
