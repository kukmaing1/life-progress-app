"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckSquare, Mountain, TrendingUp, User } from "lucide-react";
import { useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import type { TranslationKey } from "@/lib/i18n";

// Today, Progress and Profile are real (Progress shipped in the roadmap's
// Phase 1 — free calendar/history view; Profile is the identity/stats hub,
// with technical Settings one tap away from there rather than in the nav).
// Goals is still a disabled placeholder until Phase 2 (spec section 14) —
// never a fake screen.
const items = [
  { href: "/today", labelKey: "nav.today", icon: CheckSquare, enabled: true },
  { href: "#", labelKey: "nav.goals", icon: Mountain, enabled: false },
  { href: "/progress", labelKey: "nav.progress", icon: TrendingUp, enabled: true },
  { href: "/profile", labelKey: "nav.profile", icon: User, enabled: true },
] satisfies { href: string; labelKey: TranslationKey; icon: typeof CheckSquare; enabled: boolean }[];

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useLocale();
  const [comingSoon, setComingSoon] = useState<string | null>(null);

  return (
    <nav className="sticky bottom-0 border-t border-hairline bg-graphite/95 px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-2 backdrop-blur">
      {comingSoon && (
        <p className="pb-2 text-center text-xs text-cream/50">
          {t("nav.comingSoon", { feature: comingSoon })}
        </p>
      )}
      <div className="flex items-center justify-around">
        {items.map(({ href, labelKey, icon: Icon, enabled }) => {
          const label = t(labelKey);
          if (!enabled) {
            return (
              <button
                key={labelKey}
                onClick={() => setComingSoon(label)}
                className="flex flex-col items-center gap-1 px-3 py-1 text-cream/30"
              >
                <Icon size={22} strokeWidth={1.5} />
                <span className="text-[11px]">{label}</span>
              </button>
            );
          }
          const active = pathname === href;
          return (
            <Link
              key={labelKey}
              href={href}
              className={`flex flex-col items-center gap-1 px-3 py-1 ${
                active ? "text-gold" : "text-cream/50"
              }`}
            >
              <Icon size={22} strokeWidth={1.5} />
              <span className="text-[11px]">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
