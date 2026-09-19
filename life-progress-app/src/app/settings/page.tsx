"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { BottomNav } from "@/components/BottomNav";
import { apiFetch } from "@/lib/apiClient";

const APP_VERSION = "1.0.0";

export default function SettingsPage() {
  const { user, loading, refreshUser } = useAuth();
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

  const timezones =
    typeof Intl.supportedValuesOf === "function" ? Intl.supportedValuesOf("timeZone") : [timezone];

  if (loading || !user) {
    return <div className="flex flex-1 items-center justify-center text-cream/40">Loading...</div>;
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 px-6 pt-10 pb-10">
        <h1 className="font-serif text-3xl text-cream">Settings</h1>

        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cream">Notifications</p>
              <p className="text-sm text-cream/40">Basic task reminders</p>
            </div>
            <button
              disabled={saving}
              onClick={() => {
                const next = !notifications;
                setNotifications(next);
                updateSetting({ notifications_enabled: next });
              }}
              className={`h-7 w-12 rounded-pill transition-colors ${notifications ? "bg-gold" : "bg-white/10"}`}
              aria-label="Toggle notifications"
            >
              <span
                className={`block h-5 w-5 translate-x-1 rounded-full bg-graphite-dark transition-transform ${
                  notifications ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>

          <div>
            <p className="mb-2 text-cream">Timezone</p>
            <select
              value={timezone}
              disabled={saving}
              onChange={(e) => {
                setTimezone(e.target.value);
                updateSetting({ timezone: e.target.value });
              }}
              className="w-full rounded-xl bg-black/20 px-4 py-3 text-cream focus:outline-none focus:ring-1 focus:ring-gold/50"
            >
              {timezones.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>

          <div className="border-t border-white/5 pt-6">
            <p className="text-cream">Telegram account</p>
            <p className="mt-1 text-sm text-cream/50">
              {user.first_name} {user.last_name ?? ""}
              {user.username ? ` · @${user.username}` : ""}
            </p>
          </div>

          <div className="border-t border-white/5 pt-6">
            <p className="text-sm text-cream/30">Life Progress v{APP_VERSION}</p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
