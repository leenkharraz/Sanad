"use client";

import { cn } from "@/lib/utils";

interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  disabled?: boolean;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="flex gap-1.5 rounded-xl bg-surface-soft p-1"
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={option.disabled}
            onClick={() => onChange(option.value)}
            className={cn(
              "min-h-11 flex-1 rounded-lg px-3 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
              active
                ? "bg-surface text-text-primary shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
