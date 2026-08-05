"use client";

import { useEffect, useRef, useState } from "react";
import { Info, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScreenHeader } from "@/components/navigation/screen-header";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FontSizeSelector } from "@/features/settings/font-size-selector";
import { CAPTION_COLORS, captionColorHex, hexToRgba } from "@/data/caption-colors";
import { CAPTION_POSITIONS, captionPositionClasses } from "@/data/caption-positions";
import { usePreferences } from "@/components/providers/preferences-provider";
import { useNotifications } from "@/components/providers/notifications-provider";
import { useTranslation } from "@/i18n/use-translation";
import type { CaptionColor, CaptionPosition } from "@/types/preferences";

export function CaptionDisplayScreen() {
  const { preferences, updatePreferences } = usePreferences();
  const { addNotification } = useNotifications();
  const { t } = useTranslation();
  const settings = preferences.captionDisplay;
  const [savedVisible, setSavedVisible] = useState(false);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (savedTimer.current) clearTimeout(savedTimer.current);
  }, []);

  function patch(next: Partial<typeof settings>) {
    updatePreferences({ captionDisplay: { ...settings, ...next } });
  }

  // Every control above already saves instantly (consistent with the rest of
  // Settings) — this button just gives an explicit, honest confirmation
  // rather than gating persistence behind a click.
  function handleSave() {
    setSavedVisible(true);
    if (savedTimer.current) clearTimeout(savedTimer.current);
    savedTimer.current = setTimeout(() => setSavedVisible(false), 2500);
    addNotification("captionSettingsUpdated");
  }

  return (
    <div className="space-y-6 pb-4">
      <ScreenHeader title={t("settings.rows.captionDisplay")} backHref="/app/settings" />

      <div className="flex items-start gap-2.5 rounded-2xl border border-warning/30 bg-warning-soft px-4 py-3 text-sm text-warning">
        <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
        <p>{t("settingsPages.captionDisplay.hardwareNotice")}</p>
      </div>

      <section className="space-y-2">
        <Label>{t("settingsPages.captionDisplay.preview")}</Label>
        <div className="flex aspect-video w-full flex-col rounded-2xl border border-border bg-[#2b2b2b] p-3">
          <div className={cn("flex flex-1", captionPositionClasses(settings.position))}>
            <span
              className="max-w-[85%] rounded-md px-2.5 py-1 font-medium"
              style={{
                backgroundColor: hexToRgba(captionColorHex(settings.backgroundColor), settings.backgroundOpacity),
                color: captionColorHex(settings.textColor),
                fontSize:
                  settings.fontSize === "extra-large" ? "1.05rem" : settings.fontSize === "large" ? "0.9rem" : "0.78rem",
              }}
            >
              {t("settingsPages.captionDisplay.previewSampleText")}
            </span>
          </div>
        </div>
      </section>

      <section className="space-y-2">
        <Label>{t("settingsPages.captionDisplay.glassesFontSize")}</Label>
        <FontSizeSelector value={settings.fontSize} onChange={(fontSize) => patch({ fontSize })} />
      </section>

      <section className="space-y-2">
        <Label>{t("settingsPages.captionDisplay.captionPosition")}</Label>
        <div
          role="radiogroup"
          aria-label={t("settingsPages.captionDisplay.captionPosition")}
          className="grid grid-cols-3 gap-2"
        >
          {CAPTION_POSITIONS.map((option) => {
            const active = option.value === settings.position;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => patch({ position: option.value as CaptionPosition })}
                className={cn(
                  "min-h-14 rounded-xl border px-1.5 py-2 text-center text-[0.7rem] font-medium leading-tight transition-colors",
                  active
                    ? "border-brand-700 bg-surface-soft text-text-primary"
                    : "border-border bg-surface text-text-secondary hover:bg-surface-soft"
                )}
              >
                {t(option.labelKey)}
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="caption-opacity">{t("settingsPages.captionDisplay.backgroundOpacity")}</Label>
          <span className="text-sm font-medium text-text-secondary tabular-nums">
            {settings.backgroundOpacity}%
          </span>
        </div>
        <input
          id="caption-opacity"
          type="range"
          min={0}
          max={100}
          step={5}
          value={settings.backgroundOpacity}
          onChange={(event) => patch({ backgroundOpacity: Number(event.target.value) })}
          className="w-full accent-primary"
        />
      </section>

      <ColorPickerRow
        label={t("settingsPages.captionDisplay.backgroundColor")}
        value={settings.backgroundColor}
        onChange={(backgroundColor) => patch({ backgroundColor })}
      />

      <ColorPickerRow
        label={t("settingsPages.captionDisplay.textColor")}
        value={settings.textColor}
        onChange={(textColor) => patch({ textColor })}
      />

      <div className="space-y-2 pt-1">
        <Button type="button" size="touch" className="w-full" onClick={handleSave}>
          {t("common.save")}
        </Button>
        <p role="status" aria-live="polite" className={cn("text-center text-sm text-success", !savedVisible && "invisible")}>
          {t("settingsPages.captionDisplay.savedNotice")}
        </p>
      </div>
    </div>
  );
}

function ColorPickerRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: CaptionColor;
  onChange: (color: CaptionColor) => void;
}) {
  const { t } = useTranslation();
  return (
    <section className="space-y-2">
      <Label>{label}</Label>
      <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2.5">
        {CAPTION_COLORS.map((color) => {
          const active = color.value === value;
          return (
            <button
              key={color.value}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={t(color.nameKey)}
              onClick={() => onChange(color.value)}
              className={cn(
                "relative flex size-11 items-center justify-center rounded-full border-2 transition-colors",
                active ? "border-brand-700" : "border-border"
              )}
              style={{ backgroundColor: color.hex }}
            >
              {active && (
                <Check
                  aria-hidden="true"
                  className="size-4"
                  style={{ color: color.value === "white" || color.value === "yellow" ? "#1B1B1B" : "#FFFFFF" }}
                  strokeWidth={3}
                />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
