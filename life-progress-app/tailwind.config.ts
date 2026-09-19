import type { Config } from "tailwindcss";

// Centralized design tokens (see spec: "Centralize design tokens/colors,
// do not hardcode the visual system throughout the application").
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        graphite: {
          DEFAULT: "#1c1b1f",
          light: "#2a282e",
          dark: "#121114",
        },
        gold: {
          DEFAULT: "#e8b86d",
          soft: "#f0d5a8",
          muted: "#b98f52",
        },
        cream: "#f6efe3",
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
