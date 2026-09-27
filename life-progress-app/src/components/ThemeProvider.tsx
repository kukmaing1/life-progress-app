"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";

export type Theme = "dark" | "light";

const STORAGE_KEY = "lp_theme";

// Telegram's own chrome (its header bar + the area behind the webview) is
// set separately from anything CSS controls — without this it would stay
// stuck in whatever color it started as while the app's own content flips
// to light, producing a dark bar above a light page.
const CHROME_COLOR: Record<Theme, string> = {
  dark: "#1c1b1f",
  light: "#fbf8f2",
};

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeState>({ theme: "dark", setTheme: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Private browsing / storage disabled — theme still applies for this
    // load, it just won't be remembered for the next one until the user
    // record arrives from the server again.
  }
  try {
    window.Telegram?.WebApp.setBackgroundColor?.(CHROME_COLOR[theme]);
    window.Telegram?.WebApp.setHeaderColor?.(CHROME_COLOR[theme]);
  } catch {
    // Older Telegram clients may not support these calls — safe to ignore.
  }
}

/**
 * Owns the `data-theme` attribute the whole color system in globals.css
 * switches on. `theme` starts from whatever the inline script in layout.tsx
 * (or a previous render) already put on <html>, so there's no flash of the
 * wrong theme — ThemeSync below then reconciles it with the server's value
 * once the signed-in user loads, in case they changed theme on another
 * device.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";
    return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
  });

  function setTheme(next: Theme) {
    setThemeState(next);
    applyTheme(next);
  }

  useEffect(() => {
    applyTheme(theme);
    // Only on mount — this applies the starting theme to Telegram's chrome;
    // every later change goes through setTheme above instead.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

/**
 * Reconciles the theme with the signed-in user's saved preference. Split out
 * from ThemeProvider itself so ThemeProvider doesn't need to know about auth
 * — this just bridges the two once both are available. Rendered once, high
 * in the tree (see layout.tsx).
 */
export function ThemeSync() {
  const { user } = useAuth();
  const { setTheme } = useTheme();

  useEffect(() => {
    if (user) setTheme(user.theme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.theme]);

  return null;
}
