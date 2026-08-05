"use client";

import { Info, TriangleAlert, Ear, Glasses, Bell } from "lucide-react";
import { ScreenHeader } from "@/components/navigation/screen-header";
import { Switch } from "@/components/ui/switch";
import { usePreferences } from "@/components/providers/preferences-provider";
import { useTranslation, type TranslationKey } from "@/i18n/use-translation";
import type { NotificationCategory } from "@/types/notification";

const ROWS: {
  key: NotificationCategory;
  icon: typeof Bell;
  titleKey: TranslationKey;
  hintKey: TranslationKey;
}[] = [
  { key: "safety", icon: TriangleAlert, titleKey: "settingsPages.notifications.safety", hintKey: "settingsPages.notifications.safetyHint" },
  { key: "accessibility", icon: Ear, titleKey: "settingsPages.notifications.accessibility", hintKey: "settingsPages.notifications.accessibilityHint" },
  { key: "device", icon: Glasses, titleKey: "settingsPages.notifications.device", hintKey: "settingsPages.notifications.deviceHint" },
  { key: "general", icon: Bell, titleKey: "settingsPages.notifications.general", hintKey: "settingsPages.notifications.generalHint" },
];

export function NotificationSettingsScreen() {
  const { preferences, updatePreferences } = usePreferences();
  const { t } = useTranslation();
  const settings = preferences.notificationPreferences;

  function toggle(key: NotificationCategory, value: boolean) {
    updatePreferences({ notificationPreferences: { ...settings, [key]: value } });
  }

  return (
    <div className="space-y-6 pb-4">
      <ScreenHeader title={t("settings.rows.notifications")} backHref="/app/settings" />

      <div className="flex items-start gap-2.5 rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text-secondary">
        <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-700" />
        <p>{t("settingsPages.notifications.pushNotice")}</p>
      </div>

      <div className="divide-y divide-border rounded-2xl border border-border bg-surface">
        {ROWS.map((row) => {
          const Icon = row.icon;
          return (
            <div key={row.key} className="flex items-center gap-3 px-4 py-3.5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-soft text-brand-700">
                <Icon aria-hidden="true" className="size-4.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-text-primary">{t(row.titleKey)}</p>
                <p className="text-xs text-text-secondary">{t(row.hintKey)}</p>
              </div>
              <Switch
                checked={settings[row.key]}
                onCheckedChange={(value) => toggle(row.key, value)}
                aria-label={t(row.titleKey)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
