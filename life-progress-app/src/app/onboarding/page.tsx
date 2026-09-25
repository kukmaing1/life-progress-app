"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppIntro } from "@/components/AppIntro";
import { StepsIllustration } from "@/components/StepsIllustration";

export default function OnboardingPage() {
  const router = useRouter();

  useEffect(() => {
    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ eventType: "ONBOARDING_STARTED" }),
    }).catch(() => {});
  }, []);

  function handleGetStarted() {
    localStorage.setItem("lp_onboarded", "1");
    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ eventType: "ONBOARDING_COMPLETED" }),
    }).catch(() => {});
    router.replace("/today");
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-between px-8 py-16 text-center">
      <AppIntro />

      <StepsIllustration />

      <button
        onClick={handleGetStarted}
        className="w-full max-w-xs rounded-pill bg-gradient-to-r from-gold-soft to-gold py-4 font-medium text-graphite-dark shadow-glow"
      >
        Get started
      </button>
    </div>
  );
}
