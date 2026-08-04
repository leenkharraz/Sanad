"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ACCESSIBILITY_NEED_OPTIONS } from "@/data/accessibility-needs";
import { usePreferences } from "@/components/providers/preferences-provider";

export function AccessibilityNeedsEditor() {
  const { preferences, toggleAccessibilityNeed } = usePreferences();

  return (
    <div className="space-y-1">
      {ACCESSIBILITY_NEED_OPTIONS.map((option) => {
        const Icon = option.icon;
        const checked = preferences.accessibilityNeeds.includes(option.id);
        return (
          <label
            key={option.id}
            className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-2 py-2 hover:bg-surface-soft"
          >
            <Checkbox
              checked={checked}
              onCheckedChange={() => toggleAccessibilityNeed(option.id)}
              aria-label={option.title}
            />
            <Icon aria-hidden="true" className="size-4 text-brand-700" />
            <span className="text-sm text-text-primary">{option.title}</span>
          </label>
        );
      })}
    </div>
  );
}
