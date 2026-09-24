"use client";

import Link from "next/link";
import { Settings as SettingsIcon } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { BottomNav } from "@/components/BottomNav";
import { ProfileHeader } from "@/components/ProfileHeader";

/**
 * Profile — who you are and how you're doing (roadmap Phase 1, split out
 * of the old combined Settings page so "profile" and "settings" aren't the
 * same screen). Technical controls (timezone, username, notifications) live
 * one tap away at /settings via the gear icon here, not in the bottom nav.
 */
export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return <div className="flex flex-1 items-center justify-center text-cream/40">Loading...</div>;
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 overflow-y-auto px-6 pt-10 pb-28">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-3xl text-cream">Profile</h1>
          <Link
            href="/settings"
            className="flex h-9 w-9 items-center justify-center rounded-full text-cream/50 active:text-cream"
            aria-label="Settings"
          >
            <SettingsIcon size={20} />
          </Link>
        </div>

        <ProfileHeader user={user} />
      </div>

      <BottomNav />
    </div>
  );
}
