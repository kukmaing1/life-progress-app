/**
 * The shared "Life Progress" branding block — eyebrow + headline + subtext.
 * Used by both the full first-run onboarding (with a "Get started" button
 * below it) and the brief splash shown on every later open (no button, just
 * a few seconds before jumping to Today) — one place so the copy/styling
 * can't drift between the two.
 */
export function AppIntro() {
  return (
    <div>
      <p className="text-sm uppercase tracking-[0.2em] text-cream/60">Life Progress</p>
      <h1 className="mt-8 font-serif text-4xl leading-tight text-cream">
        Build a better
        <br />
        version of
        <br />
        yourself.
      </h1>
      <p className="mt-4 text-cream/50">Small actions. Real progress.</p>
    </div>
  );
}
