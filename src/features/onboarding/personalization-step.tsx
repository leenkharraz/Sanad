"use client";

import { useRouter } from "next/navigation";
import { Glasses, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/design-system/segmented-control";
import { ThemeModeSelector } from "@/features/settings/theme-mode-selector";
import { usePreferences } from "@/components/providers/preferences-provider";
import { useTranslation } from "@/i18n/use-translation";

export function PersonalizationStep() {
  const router = useRouter();
  const { preferences, updatePreferences } = usePreferences();
  const { t } = useTranslation();

  function goToHome() {
    updatePreferences({ personalizationComplete: true });
    router.push("/app/home");
  }

  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-background">
      <div className="safe-top mx-auto w-full max-w-md flex-1 px-6 pb-8 pt-8">
        <p className="text-sm font-medium text-brand-700">{t("onboarding.personalize.step")}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-text-primary">
          {t("onboarding.personalize.title")}
        </h1>
        <p className="mt-1.5 text-sm text-text-secondary">
          {t("onboarding.personalize.subtitle")}
        </p>

        <div className="mt-6 space-y-5">
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-text-primary">
              {t("onboarding.personalize.languageLabel")}
            </h2>
            <SegmentedControl
              ariaLabel={t("onboarding.personalize.languageLabel")}
              value={preferences.language}
              onChange={(language) => updatePreferences({ language })}
              options={[
                { value: "en", label: "English" },
                { value: "ar", label: "العربية" },
              ]}
            />
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-text-primary">{t("settings.fontSize.title")}</h2>
            <SegmentedControl
              ariaLabel={t("settings.fontSize.title")}
              value={preferences.fontSize}
              onChange={(fontSize) => updatePreferences({ fontSize })}
              options={[
                { value: "default", label: t("settings.fontSize.default") },
                { value: "large", label: t("settings.fontSize.large") },
                { value: "extra-large", label: t("settings.fontSize.extraLarge") },
              ]}
            />
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-text-primary">{t("settings.appearance.title")}</h2>
            <ThemeModeSelector
              value={preferences.themeMode}
              onChange={(themeMode) => updatePreferences({ themeMode })}
            />
          </section>

          <section className="space-y-2 rounded-2xl border border-dashed border-border bg-surface px-4 py-3.5">
            <div className="flex items-center gap-3">
              <Phone aria-hidden="true" className="size-5 text-text-muted" />
              <div>
                <p className="text-sm font-medium text-text-primary">
                  {t("onboarding.personalize.emergencyContactTitle")}
                </p>
                <p className="text-xs text-text-muted">{t("onboarding.personalize.emergencyContactHint")}</p>
              </div>
            </div>
          </section>

          <section className="space-y-2 rounded-2xl border border-dashed border-border bg-surface px-4 py-3.5">
            <div className="flex items-center gap-3">
              <Glasses aria-hidden="true" className="size-5 text-text-muted" />
              <div>
                <p className="text-sm font-medium text-text-primary">
                  {t("onboarding.personalize.glassesTitle")}
                </p>
                <p className="text-xs text-text-muted">{t("onboarding.personalize.glassesHint")}</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="safe-bottom safe-x mx-auto flex w-full max-w-md flex-col gap-2 px-6 pb-8">
        <Button type="button" size="touch" className="w-full" onClick={goToHome}>
          {t("onboarding.personalize.cta")}
        </Button>
        <button
          type="button"
          onClick={goToHome}
          className="min-h-11 text-sm font-medium text-text-secondary hover:text-text-primary"
        >
          {t("onboarding.personalize.skip")}
        </button>
      </div>
    </div>
  );
}
