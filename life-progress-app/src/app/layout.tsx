import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

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
      <body className="bg-graphite font-sans text-cream antialiased">
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
        <AuthProvider>
          <div className="mx-auto flex min-h-screen max-w-md flex-col">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
