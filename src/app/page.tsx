"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/design-system/brand-logo";
import { usePreferences } from "@/components/providers/preferences-provider";
import { useSession } from "@/components/providers/session-provider";

export default function SplashPage() {
  const router = useRouter();
  const { session, isLoaded: sessionLoaded } = useSession();
  const { preferences, isLoaded: preferencesLoaded } = usePreferences();

  useEffect(() => {
    if (!sessionLoaded || !preferencesLoaded) return;

    const timer = setTimeout(() => {
      if (!session) {
        router.replace("/welcome");
        return;
      }
      if (!preferences.onboardingComplete) {
        router.replace("/onboarding/accessibility");
        return;
      }
      if (!preferences.personalizationComplete) {
        router.replace("/onboarding/personalize");
        return;
      }
      router.replace("/app/home");
    }, 1400);

    return () => clearTimeout(timer);
  }, [router, session, sessionLoaded, preferences.onboardingComplete, preferences.personalizationComplete, preferencesLoaded]);

  return (
    <div className="relative flex min-h-dvh flex-1 items-center justify-center overflow-hidden bg-[#FEF3E9]">
      {/* Layered, blurred radial gradients recreating the Figma entry screen */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-16 size-72 rounded-full bg-[#A6866E]/50 blur-3xl" />
        <div className="absolute -top-10 right-0 size-80 rounded-full bg-[#B89D88]/45 blur-3xl" />
        <div className="absolute bottom-[-15%] left-1/2 size-[26rem] -translate-x-1/2 rounded-full bg-[#DBCABB]/60 blur-3xl" />
        <div className="absolute right-[-10%] bottom-0 size-72 rounded-full bg-[#EADBCD]/70 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FEF3E9]/40 to-[#FEF3E9]/80" />
      </div>

      <div className="relative flex flex-col items-center gap-3 px-6 text-center animate-in fade-in duration-700 motion-reduce:animate-none">
        <BrandLogo variant="full" priority className="h-28 w-auto drop-shadow-sm" />
      </div>

      <span className="sr-only" role="status">
        Loading SANAD
      </span>
    </div>
  );
}
