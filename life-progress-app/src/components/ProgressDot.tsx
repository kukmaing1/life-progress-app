import type { DayDotVariant } from "@/lib/progress";

const VARIANT_CLASSES: Record<DayDotVariant, string> = {
  full: "rounded-full bg-gold shadow-glow",
  partial: "rounded-full bg-gold/40",
  planned: "rounded-full border border-cream/30",
  none: "",
};

/**
 * The single dot indicator shared by the Progress calendar grid and the
 * Profile "this week" strip — one place that turns a DayDotVariant into
 * pixels, so the two views can't visually drift apart.
 */
export function ProgressDot({ variant, size = "h-1.5 w-1.5" }: { variant: DayDotVariant; size?: string }) {
  return <span className={`block ${size} ${VARIANT_CLASSES[variant]}`} />;
}
