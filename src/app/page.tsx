"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/design-system/brand-logo";
import { AmbientGlow } from "@/components/design-system/ambient-glow";
import { usePreferences } from "@/components/providers/preferences-provider";
import { useSession } from "@/components/providers/session-provider";
import { useTranslation } from "@/i18n/use-translation";

export default function SplashPage() {
  const router = useRouter();
  const { session, isLoaded: sessionLoaded } = useSession();
  const { preferences, isLoaded: preferencesLoaded } = usePreferences();
  const { t } = useTranslation();

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
    <div className="relative flex min-h-dvh flex-1 items-center justify-center overflow-hidden bg-background">
      <AmbientGlow />

      <div className="relative flex flex-col items-center gap-3 px-6 text-center animate-in fade-in duration-700 motion-reduce:animate-none">
        <BrandLogo variant="full" priority className="h-28 w-auto drop-shadow-sm" />
      </div>

      <span className="sr-only" role="status">
        {t("common.loadingSanad")}
      </span>
    </div>
  );
}
