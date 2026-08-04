"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppLogo } from "@/components/design-system/app-logo";
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
    <div
      className="flex min-h-dvh flex-1 flex-col items-center justify-center gap-6 px-6 text-center"
      style={{
        background:
          "linear-gradient(145deg, #FCF9F6 0%, #F5ECE4 48%, #E9D8CA 100%)",
      }}
    >
      <div className="animate-pulse motion-reduce:animate-none">
        <AppLogo className="size-20 drop-shadow-sm" />
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-semibold tracking-tight text-text-primary">SANAD</p>
        <p className="text-sm text-text-secondary">Smart glasses. Connected assistance.</p>
      </div>
      <span className="sr-only" role="status">
        Loading SANAD
      </span>
    </div>
  );
}
