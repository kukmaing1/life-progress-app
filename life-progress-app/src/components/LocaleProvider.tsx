"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { normalizeLocale, type Locale } from "@/lib/locale";
import { translate, type TranslationKey } from "@/lib/i18n";

const STORAGE_KEY = "lp_locale";

type Vars = Record<string, string | number>;

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, vars?: Vars) => string;
}

const LocaleContext = createContext<LocaleState>({
  locale: "en",
  setLocale: () => {},
  t: (key) => key,
});

export function useLocale() {
  return useContext(LocaleContext);
}

function readCachedLocale(): Locale {
  if (typeof window === "undefined") return "en";
  try {
    return normalizeLocale(localStorage.getItem(STORAGE_KEY));
  } catch {
    return "en";
  }
}

/**
 * Owns the app's current UI language. Starts from whatever this browser
 * cached last time (or "en") so text renders immediately with no wait on
 * the network — LocaleSync below then reconciles it with the signed-in
 * user's saved value once it arrives, in case they changed language on
 * another device. Mirrors ThemeProvider's Provider/Sync split for the same
 * reason: this component has no idea auth exists.
 *
 * Unlike theme, there's no inline no-flash <head> script for this — a text
 * swap on load isn't the same visually jarring flash a color change is, so
 * the lazy useState init here is enough.
 */
export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readCachedLocale);

  function setLocale(next: Locale) {
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private browsing / storage disabled — the choice still applies for
      // this load, it just won't be remembered until the server's value
      // comes back down again.
    }
  }

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  function t(key: TranslationKey, vars?: Vars) {
    return translate(locale, key, vars);
  }

  return <LocaleContext.Provider value={{ locale, setLocale, t }}>{children}</LocaleContext.Provider>;
}

/**
 * Reconciles the UI language with the signed-in user's saved preference,
 * once it loads. Split out from LocaleProvider itself, same shape as
 * ThemeSync. Rendered once, high in the tree (see layout.tsx).
 */
export function LocaleSync() {
  const { user } = useAuth();
  const { setLocale } = useLocale();

  useEffect(() => {
    if (user) setLocale(user.locale);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.locale]);

  return null;
}
