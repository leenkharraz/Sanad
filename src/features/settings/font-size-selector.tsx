"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation, type TranslationKey } from "@/i18n/use-translation";
import type { FontSize } from "@/types/preferences";

// Preview glyph sizes are fixed px (not rem), intentionally independent of
// the currently active --font-scale — otherwise the card itself would grow
// when "Extra large" is already selected, breaking the equal-width layout.
const OPTIONS: { value: FontSize; labelKey: TranslationKey; previewPx: number }[] = [
  { value: "default", labelKey: "settings.fontSize.default", previewPx: 18 },
  { value: "large", labelKey: "settings.fontSize.large", previewPx: 23 },
  { value: "extra-large", labelKey: "settings.fontSize.extraLarge", previewPx: 28 },
];

export function FontSizeSelector({
  value,
  onChange,
}: {
  value: FontSize;
  onChange: (size: FontSize) => void;
}) {
  const { t } = useTranslation();

  return (
    <div role="radiogroup" aria-label={t("settings.fontSize.title")} className="grid grid-cols-3 gap-2.5">
      {OPTIONS.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex min-h-11 flex-col items-center gap-2 rounded-2xl border p-2.5 transition-colors",
              active ? "border-brand-700 bg-surface-soft" : "border-border bg-surface hover:bg-surface-soft"
            )}
          >
            <span className="relative flex h-12 w-full items-center justify-center rounded-xl bg-background-soft">
              <span
                aria-hidden="true"
                className="font-semibold text-text-primary"
                style={{ fontSize: option.previewPx, lineHeight: 1 }}
              >
                Aa
              </span>
              {active && (
                <span className="absolute -top-1.5 -end-1.5 flex size-4.5 items-center justify-center rounded-full bg-brand-700 text-text-inverse">
                  <Check className="size-3" strokeWidth={3} />
                </span>
              )}
            </span>
            <span className="text-xs font-medium text-text-primary">{t(option.labelKey)}</span>
          </button>
        );
      })}
    </div>
  );
}
