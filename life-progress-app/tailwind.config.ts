import type { Config } from "tailwindcss";

// Centralized design tokens (see spec: "Centralize design tokens/colors,
// do not hardcode the visual system throughout the application").
//
// Every color below (except graphite.dark — see globals.css for why that one
// never flips) is backed by a CSS custom property defined in globals.css,
// using Tailwind's `rgb(var(--x) / <alpha-value>)` pattern. That's what lets
// dark/light theming work by just toggling a `data-theme` attribute on
// <html> — every existing `bg-graphite`, `text-cream/40`, `border-hairline`,
// etc. class across the app automatically repaints; no component markup
// changes needed for anything already using these named tokens.
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        graphite: {
          DEFAULT: "rgb(var(--color-graphite) / <alpha-value>)",
          light: "rgb(var(--color-graphite-light) / <alpha-value>)",
          // Fixed near-black, intentionally NOT theme-variable — this token's
          // only job is "dark text/icons on a gold background" (avatar
          // initials, button labels, the settings toggle knob), a pairing
          // that doesn't change when the rest of the app goes light.
          dark: "rgb(var(--color-graphite-dark) / <alpha-value>)",
        },
        gold: {
          DEFAULT: "rgb(var(--color-gold) / <alpha-value>)",
          soft: "rgb(var(--color-gold-soft) / <alpha-value>)",
          muted: "rgb(var(--color-gold-muted) / <alpha-value>)",
        },
        cream: "rgb(var(--color-cream) / <alpha-value>)",
        // Semantic surface tokens — replace the raw bg-black/X, bg-white/X,
        // border-white/X utilities that were scattered through components
        // (those never adapted to a theme; a literal white/5 border is
        // invisible on a light surface).
        hairline: {
          DEFAULT: "rgb(var(--color-hairline) / <alpha-value>)",
          strong: "rgb(var(--color-hairline-strong) / <alpha-value>)",
        },
        field: "rgb(var(--color-field) / <alpha-value>)",
        track: "rgb(var(--color-track) / <alpha-value>)",
        pressed: "rgb(var(--color-pressed) / <alpha-value>)",
      },
      // System font stacks — deliberately not a webfont, so there's no external
      // fetch at build time and the app still renders instantly offline.
      fontFamily: {
        serif: [
          "Georgia",
          '"Iowan Old Style"',
          "Baskerville",
          '"Times New Roman"',
          "serif",
        ],
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
      },
      borderRadius: {
        card: "20px",
        pill: "999px",
      },
      boxShadow: {
        glow: "0 0 40px rgba(232, 184, 109, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
