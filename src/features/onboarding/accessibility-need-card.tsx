"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n/use-translation";
import type { AccessibilityNeedOption } from "@/data/accessibility-needs";

export function AccessibilityNeedCard({
  option,
  selected,
  onToggle,
}: {
  option: AccessibilityNeedOption;
  selected: boolean;
  onToggle: () => void;
}) {
  const Icon = option.icon;
  const { t, tList } = useTranslation();
  const title = t(option.titleKey);
  const description = t(option.descriptionKey);
  const functions = tList(option.functionsKey);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={selected}
      aria-label={`${title}. ${description}`}
      onClick={onToggle}
      className={cn(
        "flex w-full items-start gap-4 rounded-2xl border px-4 py-4 text-start transition-colors",
        selected
          ? "border-brand-700 bg-surface-selected"
          : "border-border bg-surface hover:bg-surface-soft"
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-xl",
          selected ? "bg-brand-800 text-text-inverse" : "bg-surface-soft text-brand-700"
        )}
      >
        <Icon className="size-6" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-text-primary">{title}</h3>
          <span
            aria-hidden="true"
            className={cn(
              "flex size-6 shrink-0 items-center justify-center rounded-full border-2",
              selected
                ? "border-brand-800 bg-brand-800 text-text-inverse"
                : "border-border bg-transparent"
            )}
          >
            {selected && <Check className="size-3.5" strokeWidth={3} />}
          </span>
        </div>
        <p className="mt-1 text-sm text-text-secondary">{description}</p>
        <ul className="mt-2.5 flex flex-wrap gap-1.5">
          {functions.map((fn) => (
            <li
              key={fn}
              className="rounded-full bg-surface-soft px-2.5 py-1 text-xs text-text-secondary"
            >
              {fn}
            </li>
          ))}
        </ul>
      </div>
    </button>
  );
}
