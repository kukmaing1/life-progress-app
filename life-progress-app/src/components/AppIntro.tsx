"use client";

import { useLocale } from "@/components/LocaleProvider";

/**
 * The shared "Life Progress" branding block — eyebrow + headline + subtext.
 * Used by both the full first-run onboarding (with a "Get started" button
 * below it) and the brief splash shown on every later open (no button, just
 * a few seconds before jumping to Today) — one place so the copy/styling
 * can't drift between the two.
 *
 * The headline used to be 3 hardcoded lines ("Build a better" / "version
 * of" / "yourself.") broken at fixed word positions. That only works in
 * English — other languages don't share its word order, so forcing a
 * translation into the same 3 fixed lines would produce something visibly
 * mangled. It's one natural sentence per language now, left to wrap on its
 * own via CSS.
 */
export function AppIntro() {
  const { t } = useLocale();

  return (
    <div>
      <p className="text-sm uppercase tracking-[0.2em] text-cream/60">Life Progress</p>
      <h1 className="mt-8 font-serif text-4xl leading-tight text-cream">{t("appIntro.headline")}</h1>
      <p className="mt-4 text-cream/50">{t("appIntro.subtext")}</p>
    </div>
  );
}
