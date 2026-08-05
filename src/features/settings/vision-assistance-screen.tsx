"use client";

import { Info, Scan, Ruler, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScreenHeader } from "@/components/navigation/screen-header";
import { Switch } from "@/components/ui/switch";
import { usePreferences } from "@/components/providers/preferences-provider";
import { useTranslation, type TranslationKey } from "@/i18n/use-translation";
import type { VisionAssistanceSettings } from "@/types/preferences";

const ROWS: {
  key: keyof VisionAssistanceSettings;
  icon: typeof Scan;
  titleKey: TranslationKey;
  hintKey: TranslationKey;
}[] = [
  {
    key: "objectDetection",
    icon: Scan,
    titleKey: "settingsPages.visionAssistance.objectDetection",
    hintKey: "settingsPages.visionAssistance.objectDetectionHint",
  },
  {
    key: "distanceAlerts",
    icon: Ruler,
    titleKey: "settingsPages.visionAssistance.distanceAlerts",
    hintKey: "settingsPages.visionAssistance.distanceAlertsHint",
  },
  {
    key: "readingMode",
    icon: BookOpen,
    titleKey: "settingsPages.visionAssistance.readingMode",
    hintKey: "settingsPages.visionAssistance.readingModeHint",
  },
];

export function VisionAssistanceScreen() {
  const { preferences, updatePreferences } = usePreferences();
  const { t } = useTranslation();
  const settings = preferences.visionAssistance;

  function toggle(key: keyof VisionAssistanceSettings, value: boolean) {
    updatePreferences({ visionAssistance: { ...settings, [key]: value } });
  }

  return (
    <div className="space-y-6 pb-4">
      <ScreenHeader title={t("settings.rows.visionAssistance")} backHref="/app/settings" />

      <div className="flex items-start gap-2.5 rounded-2xl border border-warning/30 bg-warning-soft px-4 py-3 text-sm text-warning">
        <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
        <p>{t("settingsPages.visionAssistance.hardwareNotice")}</p>
      </div>

      <div className="divide-y divide-border rounded-2xl border border-border bg-surface">
        {ROWS.map((row) => {
          const Icon = row.icon;
          const checked = settings[row.key];
          return (
            <div key={row.key} className="flex items-center gap-3 px-4 py-3.5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent-secondary text-brand-700">
                <Icon aria-hidden="true" className="size-4.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-text-primary">{t(row.titleKey)}</p>
                <p className="text-xs text-text-secondary">{t(row.hintKey)}</p>
              </div>
              <span
                className={cn(
                  "text-xs font-medium tabular-nums",
                  checked ? "text-success" : "text-text-muted"
                )}
              >
                {checked ? t("settingsPages.visionAssistance.on") : t("settingsPages.visionAssistance.off")}
              </span>
              <Switch checked={checked} onCheckedChange={(value) => toggle(row.key, value)} aria-label={t(row.titleKey)} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
