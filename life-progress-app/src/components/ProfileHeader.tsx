"use client";

import { useEffect, useState } from "react";
import { Flame, CheckCircle2 } from "lucide-react";
import { apiFetch } from "@/lib/apiClient";
import type { User } from "@/lib/types";

interface ProfileStats {
  streak: number;
  totalCompleted: number;
}

function initials(user: User): string {
  const first = user.first_name?.[0] ?? "";
  const last = user.last_name?.[0] ?? "";
  return (first + last).toUpperCase() || "?";
}

/**
 * The "hook them in the first seconds" personalization block (roadmap Phase 1):
 * avatar (Telegram photo when available, initials otherwise — most users
 * won't have one loaded on first use, so this must never look broken) +
 * a greeting + streak/total, both free, no AI involved.
 */
export function ProfileHeader({ user }: { user: User }) {
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    apiFetch<ProfileStats>("/api/profile/stats")
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch(() => {
        // Decorative — a failed fetch just leaves the streak/total blank, no error banner.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const showPhoto = Boolean(user.photo_url) && !imgFailed;

  return (
    <div className="mb-8 flex items-center gap-4 border-b border-white/5 pb-8">
      {showPhoto ? (
        // eslint-disable-next-line @next/next/no-img-element -- external Telegram CDN URL, not a local asset
        <img
          src={user.photo_url!}
          alt=""
          onError={() => setImgFailed(true)}
          className="h-14 w-14 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-soft to-gold font-serif text-lg text-graphite-dark">
          {initials(user)}
        </div>
      )}

      <div>
        <p className="font-serif text-xl text-cream">Hey, {user.first_name}</p>
        <div className="mt-1 flex items-center gap-3 text-sm text-cream/50">
          <span className="flex items-center gap-1">
            <Flame size={14} className={stats && stats.streak > 0 ? "text-gold" : ""} />
            {stats ? `${stats.streak}-day streak` : "…"}
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 size={14} />
            {stats ? `${stats.totalCompleted} done` : "…"}
          </span>
        </div>
      </div>
    </div>
  );
}
