"use client";

import { Info } from "lucide-react";
import { ScreenHeader } from "@/components/navigation/screen-header";
import { Label } from "@/components/ui/label";
import { usePreferences } from "@/components/providers/preferences-provider";
import { useTranslation } from "@/i18n/use-translation";
import type { AppLanguage } from "@/types/preferences";

export function TranslationSettingsScreen() {
  const { preferences, updatePreferences } = usePreferences();
  const { t } = useTranslation();
  const settings = preferences.translation;

  function patch(next: Partial<typeof settings>) {
    updatePreferences({ translation: { ...settings, ...next } });
  }

  const languageOptions: { value: AppLanguage; label: string }[] = [
    { value: "en", label: t("settingsPages.translation.english") },
    { value: "ar", label: t("settingsPages.translation.arabic") },
  ];

  return (
    <div className="space-y-6 pb-4">
      <ScreenHeader title={t("settings.rows.translation")} backHref="/app/settings" />

      <div className="flex items-start gap-2.5 rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text-secondary">
        <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-700" />
        <p>{t("settingsPages.translation.helperNote")}</p>
      </div>

      <section className="space-y-2">
        <Label htmlFor="translate-from">{t("settingsPages.translation.from")}</Label>
        <select
          id="translate-from"
          dir="ltr"
          value={settings.from}
          onChange={(event) => patch({ from: event.target.value as AppLanguage })}
          className="h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-start text-sm text-text-primary"
        >
          {languageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </section>

      <section className="space-y-2">
        <Label htmlFor="translate-to">{t("settingsPages.translation.to")}</Label>
        <select
          id="translate-to"
          dir="ltr"
          value={settings.to}
          onChange={(event) => patch({ to: event.target.value as AppLanguage })}
          className="h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-start text-sm text-text-primary"
        >
          {languageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </section>
    </div>
  );
}
