"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation, type TranslationKey } from "@/i18n/use-translation";
import type { ThemeMode } from "@/types/preferences";

// Intentionally hardcoded — these swatches must always show what each mode
// actually looks like, regardless of which theme is currently active.
const PREVIEWS: { value: ThemeMode; labelKey: TranslationKey; bg: string; dots: string[] }[] = [
  { value: "light", labelKey: "settings.appearance.light", bg: "#FAF7F0", dots: ["#7B5E4A", "#D1B89A"] },
  { value: "calm", labelKey: "settings.appearance.calm", bg: "#FAF7F0", dots: ["#D1E7FE", "#F3D9FF", "#BAF1E3"] },
  { value: "dark", labelKey: "settings.appearance.dark", bg: "#1B1B1B", dots: ["#D1B89A", "#A67C52"] },
];

export function ThemeModeSelector({
  value,
  onChange,
}: {
  value: ThemeMode;
  onChange: (mode: ThemeMode) => void;
}) {
  const { t } = useTranslation();

  return (
    <div role="radiogroup" aria-label={t("settings.appearance.title")} className="grid grid-cols-3 gap-2.5">
      {PREVIEWS.map((preview) => {
        const active = preview.value === value;
        return (
          <button
            key={preview.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(preview.value)}
            className={cn(
              "flex min-h-11 flex-col items-center gap-2 rounded-2xl border p-2.5 transition-colors",
              active ? "border-brand-700 bg-surface-soft" : "border-border bg-surface hover:bg-surface-soft"
            )}
          >
            <span
              className="relative flex h-12 w-full items-center justify-center gap-1 rounded-xl border border-black/5"
              style={{ backgroundColor: preview.bg }}
            >
              {preview.dots.map((dot, i) => (
                <span
                  key={i}
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: dot }}
                  aria-hidden="true"
                />
              ))}
              {active && (
                <span className="absolute -top-1.5 -end-1.5 flex size-4.5 items-center justify-center rounded-full bg-brand-700 text-text-inverse">
                  <Check className="size-3" strokeWidth={3} />
                </span>
              )}
            </span>
            <span className="text-xs font-medium text-text-primary">{t(preview.labelKey)}</span>
          </button>
        );
      })}
    </div>
  );
}
