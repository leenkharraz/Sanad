"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ACCESSIBILITY_NEED_OPTIONS } from "@/data/accessibility-needs";
import { AccessibilityNeedCard } from "@/features/onboarding/accessibility-need-card";
import { usePreferences } from "@/components/providers/preferences-provider";
import { useTranslation } from "@/i18n/use-translation";

export function AccessibilityNeedsStep() {
  const router = useRouter();
  const { preferences, toggleAccessibilityNeed, updatePreferences } = usePreferences();
  const { t } = useTranslation();

  function goNext() {
    updatePreferences({ onboardingComplete: true });
    router.push("/onboarding/personalize");
  }

  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-background">
      <div className="safe-top mx-auto w-full max-w-md flex-1 px-6 pb-8 pt-8">
        <p className="text-sm font-medium text-brand-700">{t("onboarding.accessibility.step")}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-text-primary">
          {t("onboarding.accessibility.title")}
        </h1>
        <p className="mt-1.5 text-sm text-text-secondary">
          {t("onboarding.accessibility.subtitle")}
        </p>

        <div className="mt-6 space-y-3">
          {ACCESSIBILITY_NEED_OPTIONS.map((option) => (
            <AccessibilityNeedCard
              key={option.id}
              option={option}
              selected={preferences.accessibilityNeeds.includes(option.id)}
              onToggle={() => toggleAccessibilityNeed(option.id)}
            />
          ))}
        </div>
      </div>

      <div className="safe-bottom safe-x mx-auto flex w-full max-w-md flex-col gap-2 px-6 pb-8">
        <Button type="button" size="touch" className="w-full" onClick={goNext}>
          {t("onboarding.accessibility.continue")}
        </Button>
        <button
          type="button"
          onClick={goNext}
          className="min-h-11 text-sm font-medium text-text-secondary hover:text-text-primary"
        >
          {t("onboarding.accessibility.skip")}
        </button>
      </div>
    </div>
  );
}
