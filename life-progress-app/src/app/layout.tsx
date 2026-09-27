import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { ThemeProvider, ThemeSync } from "@/components/ThemeProvider";

// Runs synchronously while the HTML is still being parsed, before the first
// paint and before React hydrates — reads the last theme this browser saved
// (see ThemeProvider.tsx) and sets it on <html> right away. Without this, a
// returning light-theme user would see a flash of the dark default for a
// moment on every open, until React mounts and ThemeProvider catches up.
const NO_FLASH_THEME_SCRIPT = `
try {
  if (localStorage.getItem("lp_theme") === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  }
} catch (e) {}
`;

// Deliberately using the system font stack (see tailwind.config.ts) instead of
// next/font/google: zero external fetch at build time, works offline, and
// still reads as elegant serif headings + clean sans body per the design ref.

export const metadata: Metadata = {
  title: "Life Progress",
  description: "Build a better version of yourself. Small actions. Real progress.",
};

export const viewport: Viewport = {
  themeColor: "#1c1b1f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_THEME_SCRIPT }} />
      </head>
      <body className="bg-graphite font-sans text-cream antialiased">
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
        <ThemeProvider>
          <AuthProvider>
            <ThemeSync />
            <div className="mx-auto flex min-h-screen max-w-md flex-col">{children}</div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
