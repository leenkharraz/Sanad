"use client";

import { FontSizeSelector } from "@/features/settings/font-size-selector";
import { ThemeModeSelector } from "@/features/settings/theme-mode-selector";
import { usePreferences } from "@/components/providers/preferences-provider";
import { useTranslation } from "@/i18n/use-translation";

export function AppTextDisplaySection() {
  const { preferences, updatePreferences } = usePreferences();
  const { t } = useTranslation();

  return (
    <section className="space-y-4">
      <h2 className="text-sm font-semibold text-text-primary">{t("settings.appTextDisplayTitle")}</h2>

      <div className="space-y-2">
        <div>
          <p className="text-sm font-medium text-text-primary">{t("settings.fontSize.title")}</p>
          <p className="text-xs text-text-secondary">{t("settings.fontSize.helper")}</p>
        </div>
        <FontSizeSelector
          value={preferences.fontSize}
          onChange={(fontSize) => updatePreferences({ fontSize })}
        />
      </div>

      <div className="space-y-2">
        <div>
          <p className="text-sm font-medium text-text-primary">{t("settings.appearance.title")}</p>
          <p className="text-xs text-text-secondary">{t("settings.appearance.helper")}</p>
        </div>
        <ThemeModeSelector
          value={preferences.themeMode}
          onChange={(themeMode) => updatePreferences({ themeMode })}
        />
      </div>
    </section>
  );
}
