"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const onboarded = typeof window !== "undefined" && localStorage.getItem("lp_onboarded") === "1";
    router.replace(onboarded ? "/today" : "/onboarding");
  }, [router]);

  return null;
}
