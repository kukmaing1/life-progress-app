"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@/lib/types";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
  error: null,
  refreshUser: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        initData: string;
        colorScheme?: string;
        setHeaderColor?: (color: string) => void;
        setBackgroundColor?: (color: string) => void;
      };
    };
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function authenticate() {
    setLoading(true);
    setError(null);

    const tg = typeof window !== "undefined" ? window.Telegram?.WebApp : undefined;

    // Outside Telegram (e.g. testing the URL directly in a browser) there is
    // no initData to validate, so we stop here rather than pretending to log in.
    if (!tg || !tg.initData) {
      setError("Open this app from inside Telegram.");
      setLoading(false);
      return;
    }

    tg.ready();
    tg.expand();
    try {
      tg.setBackgroundColor?.("#1c1b1f");
      tg.setHeaderColor?.("#1c1b1f");
    } catch {
      // Older Telegram clients may not support these calls — safe to ignore.
    }

    try {
      const res = await fetch("/api/auth/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ initData: tg.initData }),
      });
      if (!res.ok) throw new Error("auth_failed");
      const data = await res.json();
      setUser(data.user);
    } catch {
      setError("Couldn't sign you in. Close and reopen the app to try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    authenticate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, refreshUser: authenticate }}>
      {children}
    </AuthContext.Provider>
  );
}
