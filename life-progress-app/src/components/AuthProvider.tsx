"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
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
  const { t } = useLocale();
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
      setError(t("errors.openInTelegram"));
      setLoading(false);
      return;
    }

    tg.ready();
    tg.expand();
    // Telegram's chrome color (header bar + background) is set by
    // ThemeProvider instead, since it needs to track the user's theme
    // preference rather than a single hardcoded value.

    // Best-effort device timezone (e.g. "Europe/Kyiv") so the server isn't stuck
    // defaulting new users to UTC — see lib/date.ts, "today" must follow the
    // user's real timezone, not the server's. If detection throws for any
    // reason, we just omit it and the server keeps whatever it already has.
    let timezone: string | undefined;
    try {
      timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      timezone = undefined;
    }

    try {
      const res = await fetch("/api/auth/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ initData: tg.initData, timezone }),
      });
      if (!res.ok) throw new Error("auth_failed");
      const data = await res.json();
      setUser(data.user);
    } catch {
      setError(t("errors.signInFailed"));
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
