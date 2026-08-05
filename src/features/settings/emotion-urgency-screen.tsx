"use client";

import { Info, Smile, Meh, Frown, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScreenHeader } from "@/components/navigation/screen-header";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SegmentedControl } from "@/components/design-system/segmented-control";
import { usePreferences } from "@/components/providers/preferences-provider";
import { useTranslation, type TranslationKey } from "@/i18n/use-translation";
import type { EmotionSensitivity } from "@/types/preferences";

const STATES: { key: TranslationKey; icon: typeof Smile; accent: string }[] = [
  { key: "settingsPages.emotionUrgency.states.happy", icon: Smile, accent: "bg-success-soft text-success" },
  { key: "settingsPages.emotionUrgency.states.neutral", icon: Meh, accent: "bg-surface-soft text-text-secondary" },
  { key: "settingsPages.emotionUrgency.states.concerned", icon: Frown, accent: "bg-warning-soft text-warning" },
  { key: "settingsPages.emotionUrgency.states.urgent", icon: TriangleAlert, accent: "bg-danger-soft text-danger" },
];

export function EmotionUrgencyScreen() {
  const { preferences, updatePreferences } = usePreferences();
  const { t } = useTranslation();
  const settings = preferences.emotionUrgency;

  function patch(next: Partial<typeof settings>) {
    updatePreferences({ emotionUrgency: { ...settings, ...next } });
  }

  // Illustrative only: sensitivity doesn't come from a real detector (there's
  // no camera/audio analysis behind this yet), but it genuinely reflects the
  // saved preference — "low" previews the single highest-priority state,
  // "high" previews all of them, matching how a stricter vs. looser
  // detection threshold would surface fewer or more states.
  const previewStates = settings.enabled
    ? settings.sensitivity === "high"
      ? STATES
      : STATES.filter((state) => state.key === "settingsPages.emotionUrgency.states.urgent")
    : [];

  return (
    <div className="space-y-6 pb-4">
      <ScreenHeader title={t("settings.rows.emotionUrgency")} backHref="/app/settings" />

      <div className="flex items-start gap-2.5 rounded-2xl border border-warning/30 bg-warning-soft px-4 py-3 text-sm text-warning">
        <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
        <p>{t("settingsPages.emotionUrgency.hardwareNotice")}</p>
      </div>

      <section className="flex items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3.5">
        <div>
          <p className="text-sm font-semibold text-text-primary">
            {t("settingsPages.emotionUrgency.emotionDetection")}
          </p>
          <p className="text-xs text-text-secondary">{t("settingsPages.emotionUrgency.detectionHelper")}</p>
        </div>
        <Switch
          checked={settings.enabled}
          onCheckedChange={(enabled) => patch({ enabled })}
          aria-label={t("settingsPages.emotionUrgency.emotionDetection")}
        />
      </section>

      <section className={cn("space-y-2 transition-opacity", !settings.enabled && "opacity-60")}>
        <Label>{t("settingsPages.emotionUrgency.sensitivity")}</Label>
        <SegmentedControl<EmotionSensitivity>
          ariaLabel={t("settingsPages.emotionUrgency.sensitivity")}
          value={settings.sensitivity}
          onChange={(sensitivity) => patch({ sensitivity })}
          options={[
            { value: "low", label: t("settingsPages.emotionUrgency.low"), disabled: !settings.enabled },
            { value: "high", label: t("settingsPages.emotionUrgency.high"), disabled: !settings.enabled },
          ]}
        />
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-text-primary">
          {t("settingsPages.emotionUrgency.livePreview")}
        </h2>
        <div className="grid grid-cols-2 gap-2.5">
          {STATES.map((state) => {
            const Icon = state.icon;
            const active = previewStates.includes(state);
            return (
              <div
                key={state.key}
                className={cn(
                  "flex items-center gap-2.5 rounded-2xl border border-border bg-surface px-3.5 py-3 transition-opacity",
                  !active && "opacity-40"
                )}
              >
                <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", state.accent)}>
                  <Icon aria-hidden="true" className="size-4.5" />
                </span>
                <span className="text-sm font-medium text-text-primary">{t(state.key)}</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
