"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppIntro } from "@/components/AppIntro";
import { StepsIllustration } from "@/components/StepsIllustration";

// How long the branded splash stays up for a returning user before jumping
// to Today — just long enough to read "Life Progress" and see the app is
// alive, never an instant jump straight into the task list. Runs alongside
// AuthProvider's own sign-in request (it fires from the root layout on
// every route, this one included), so by the time this timer ends the real
// data is usually already there and Today won't show its own extra spinner.
const SPLASH_DURATION_MS = 3000;

export default function RootPage() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    const onboarded = typeof window !== "undefined" && localStorage.getItem("lp_onboarded") === "1";
    if (!onboarded) {
      router.replace("/onboarding");
      return;
    }

    setShowSplash(true);
    const timer = setTimeout(() => router.replace("/today"), SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, [router]);

  if (!showSplash) return null;

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 py-16 text-center">
      <AppIntro />
      <div className="mt-12">
        <StepsIllustration />
      </div>
    </div>
  );
}
