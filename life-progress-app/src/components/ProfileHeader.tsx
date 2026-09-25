"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Flame, CheckCircle2 } from "lucide-react";
import { apiFetch } from "@/lib/apiClient";
import { formatWeekdayShort, getDateInTimezone } from "@/lib/date";
import { dayDotVariant } from "@/lib/progress";
import { ProgressDot } from "@/components/ProgressDot";
import type { DailyProgress, User, WeekProgress } from "@/lib/types";

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
 * The Profile page's hero block (roadmap Phase 1; originally an inline
 * strip at the top of the old combined Settings page, now the whole point
 * of its own Profile page): a bigger centered avatar + name + stat cards,
 * plus a "this week" strip so the page doesn't dead-end in empty space
 * below the stats — it links through to the full Progress history. Avatar
 * is the Telegram photo when available, initials otherwise — most users
 * won't have one loaded on first use, so this must never look broken.
 */
export function ProfileHeader({ user }: { user: User }) {
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [imgFailed, setImgFailed] = useState(false);
  const [week, setWeek] = useState<DailyProgress[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiFetch<ProfileStats>("/api/profile/stats")
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch(() => {
        // Decorative — a failed fetch just leaves the stat cards blank, no error banner.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    apiFetch<WeekProgress>("/api/progress/week")
      .then((data) => {
        if (!cancelled) setWeek(data.days);
      })
      .catch(() => {
        // Decorative — a failed fetch just leaves the strip blank, no error banner.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const showPhoto = Boolean(user.photo_url) && !imgFailed;
  const today = getDateInTimezone(user.timezone);

  return (
    <div className="flex flex-col items-center pb-8 pt-4 text-center">
      {showPhoto ? (
        // eslint-disable-next-line @next/next/no-img-element -- external Telegram CDN URL, not a local asset
        <img
          src={user.photo_url!}
          alt=""
          onError={() => setImgFailed(true)}
          className="h-24 w-24 rounded-full object-cover shadow-glow"
        />
      ) : (
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-soft to-gold font-serif text-3xl text-graphite-dark shadow-glow">
          {initials(user)}
        </div>
      )}

      <p className="mt-4 font-serif text-2xl text-cream">
        {user.first_name} {user.last_name ?? ""}
      </p>
      {user.username && <p className="mt-0.5 text-sm text-cream/40">@{user.username}</p>}

      <div className="mt-6 grid w-full grid-cols-2 gap-3">
        <div className="rounded-card border border-white/5 bg-white/[0.03] py-4">
          <div className="flex items-center justify-center gap-1.5">
            <Flame size={18} className={stats && stats.streak > 0 ? "text-gold" : "text-cream/30"} />
            <span className="font-serif text-2xl text-cream">{stats ? stats.streak : "…"}</span>
          </div>
          <p className="mt-1 text-xs uppercase tracking-[0.1em] text-cream/40">Day streak</p>
        </div>
        <div className="rounded-card border border-white/5 bg-white/[0.03] py-4">
          <div className="flex items-center justify-center gap-1.5">
            <CheckCircle2 size={18} className="text-gold" />
            <span className="font-serif text-2xl text-cream">{stats ? stats.totalCompleted : "…"}</span>
          </div>
          <p className="mt-1 text-xs uppercase tracking-[0.1em] text-cream/40">Completed</p>
        </div>
      </div>

      <Link
        href="/progress"
        className="mt-3 block w-full rounded-card border border-white/5 bg-white/[0.03] px-4 py-4 text-left active:bg-white/[0.06]"
      >
        <div className="flex items-center justify-between text-cream/50">
          <span className="text-xs font-medium uppercase tracking-[0.1em]">This week</span>
          <ChevronRight size={16} />
        </div>
        <div className="mt-3 flex items-center justify-between">
          {(week ?? Array.from({ length: 7 }, () => null)).map((day, i) => (
            <div key={day?.date ?? i} className="flex flex-col items-center gap-1.5">
              <span
                className={`text-[10px] uppercase tracking-wide ${
                  day && day.date === today ? "text-gold" : "text-cream/30"
                }`}
              >
                {day ? formatWeekdayShort(day.date) : ""}
              </span>
              <ProgressDot variant={dayDotVariant(day ?? undefined)} size="h-2 w-2" />
            </div>
          ))}
        </div>
      </Link>
    </div>
  );
}
