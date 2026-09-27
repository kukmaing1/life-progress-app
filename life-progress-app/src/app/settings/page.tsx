"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Moon, Sun } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { BottomNav } from "@/components/BottomNav";
import { useTheme, type Theme } from "@/components/ThemeProvider";
import { useLocale } from "@/components/LocaleProvider";
import { apiFetch } from "@/lib/apiClient";
import { LOCALE_NATIVE_NAME, SUPPORTED_LOCALES, type Locale } from "@/lib/locale";

const APP_VERSION = "1.0.0";

export default function SettingsPage() {
  const { user, loading, refreshUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const { locale, setLocale, t } = useLocale();
  const [timezone, setTimezone] = useState("UTC");
  const [notifications, setNotifications] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setTimezone(user.timezone);
      setNotifications(user.notifications_enabled);
    }
  }, [user]);

  useEffect(() => {
    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ eventType: "SETTINGS_OPENED" }),
    }).catch(() => {});
  }, []);

  async function updateSetting(patch: { timezone?: string; notifications_enabled?: boolean }) {
    setSaving(true);
    try {
      await apiFetch("/api/me", { method: "PATCH", body: JSON.stringify(patch) });
      await refreshUser();
    } finally {
      setSaving(false);
    }
  }

  async function handleThemeChange(next: Theme) {
    if (next === theme) return;
    const previous = theme;
    setTheme(next); // instant — repaints immediately, no waiting on the network
    setSaving(true);
    try {
      await apiFetch("/api/me", { method: "PATCH", body: JSON.stringify({ theme: next }) });
      await refreshUser();
    } catch {
      // The save failed — don't leave the UI claiming a preference that
      // never actually persisted (it would silently revert on next open).
      setTheme(previous);
    } finally {
      setSaving(false);
    }
  }

  async function handleLocaleChange(next: Locale) {
    if (next === locale) return;
    const previous = locale;
    setLocale(next); // instant, same reasoning as handleThemeChange above
    setSaving(true);
    try {
      await apiFetch("/api/me", { method: "PATCH", body: JSON.stringify({ locale: next }) });
      await refreshUser();
    } catch {
      setLocale(previous);
    } finally {
      setSaving(false);
    }
  }

  const timezones =
    typeof Intl.supportedValuesOf === "function" ? Intl.supportedValuesOf("timeZone") : [timezone];

  if (loading || !user) {
    return <div className="flex flex-1 items-center justify-center text-cream/40">{t("common.loading")}</div>;
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 px-6 pt-10 pb-10">
        <div className="flex items-center gap-3">
          <Link
            href="/profile"
            className="flex h-8 w-8 items-center justify-center text-cream/50 active:text-cream"
            aria-label={t("settings.backAria")}
          >
            <ChevronLeft size={22} />
          </Link>
          <h1 className="font-serif text-2xl text-cream">{t("settings.title")}</h1>
        </div>

        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cream">{t("settings.notifications")}</p>
              <p className="text-sm text-cream/40">{t("settings.notificationsSub")}</p>
            </div>
            <button
              disabled={saving}
              onClick={() => {
                const next = !notifications;
                setNotifications(next);
                updateSetting({ notifications_enabled: next });
              }}
              className={`h-7 w-12 rounded-pill transition-colors ${notifications ? "bg-gold" : "bg-track"}`}
              aria-label={t("settings.notificationsAria")}
            >
              <span
                className={`block h-5 w-5 translate-x-1 rounded-full bg-graphite-dark transition-transform ${
                  notifications ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-cream">{t("settings.appearance")}</p>
              <p className="text-sm text-cream/40">{t("settings.appearanceSub")}</p>
            </div>
            <div className="flex gap-1 rounded-pill bg-field p-1">
              <button
                disabled={saving}
                onClick={() => handleThemeChange("dark")}
                aria-label={t("settings.darkAria")}
                aria-pressed={theme === "dark"}
                className={`flex h-8 w-8 items-center justify-center rounded-pill transition-colors ${
                  theme === "dark" ? "bg-gold text-graphite-dark" : "text-cream/40"
                }`}
              >
                <Moon size={16} />
              </button>
              <button
                disabled={saving}
                onClick={() => handleThemeChange("light")}
                aria-label={t("settings.lightAria")}
                aria-pressed={theme === "light"}
                className={`flex h-8 w-8 items-center justify-center rounded-pill transition-colors ${
                  theme === "light" ? "bg-gold text-graphite-dark" : "text-cream/40"
                }`}
              >
                <Sun size={16} />
              </button>
            </div>
          </div>

          <div>
            <p className="mb-2 text-cream">{t("settings.language")}</p>
            <p className="mb-2 text-sm text-cream/40">{t("settings.languageSub")}</p>
            {/* Each option shows its OWN language's name for itself (never
                translated — see LOCALE_NATIVE_NAME) so a Russian speaker
                scanning this list sees "Русский", not the English word
                "Russian" they'd have to already know to look for. */}
            <select
              value={locale}
              disabled={saving}
              onChange={(e) => handleLocaleChange(e.target.value as Locale)}
              className="w-full rounded-xl bg-field px-4 py-3 text-cream focus:outline-none focus:ring-1 focus:ring-gold/50"
            >
              {SUPPORTED_LOCALES.map((code) => (
                <option key={code} value={code}>
                  {LOCALE_NATIVE_NAME[code]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="mb-2 text-cream">{t("settings.timezone")}</p>
            <select
              value={timezone}
              disabled={saving}
              onChange={(e) => {
                setTimezone(e.target.value);
                updateSetting({ timezone: e.target.value });
              }}
              className="w-full rounded-xl bg-field px-4 py-3 text-cream focus:outline-none focus:ring-1 focus:ring-gold/50"
            >
              {timezones.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>

          <div className="border-t border-hairline pt-6">
            <p className="text-cream">{t("settings.account")}</p>
            <p className="mt-1 text-sm text-cream/50">
              {user.first_name} {user.last_name ?? ""}
              {user.username ? ` · @${user.username}` : ""}
            </p>
          </div>

          <div className="border-t border-hairline pt-6">
            <p className="text-sm text-cream/30">Life Progress v{APP_VERSION}</p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
