"use client";

import { Minus, Plus, Waves } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { usePreferences } from "@/components/providers/preferences-provider";

const STEP = 10;

export function NoiseFilterCard() {
  const { preferences, updatePreferences } = usePreferences();
  const { enabled, level } = preferences.noiseFilter;

  function setLevel(next: number) {
    updatePreferences({ noiseFilter: { enabled, level: Math.min(100, Math.max(0, next)) } });
  }

  return (
    <section aria-labelledby="noise-filter-heading" className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h2 id="noise-filter-heading" className="text-sm font-semibold text-text-primary">
          Noise filtering
        </h2>
        <Switch
          checked={enabled}
          onCheckedChange={(checked) =>
            updatePreferences({ noiseFilter: { enabled: checked, level } })
          }
          aria-label="Enable noise filtering"
        />
      </div>

      <div
        className={cn(
          "rounded-2xl border border-border bg-surface px-4 py-3.5 transition-opacity",
          !enabled && "opacity-60"
        )}
      >
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-soft text-brand-700">
            <Waves aria-hidden="true" className="size-4.5" />
          </span>
          <div className="min-w-0 flex-1">
            <Progress value={level} className="h-2" />
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={!enabled}
              onClick={() => setLevel(level - STEP)}
              aria-label="Decrease noise filtering level"
              className="flex size-8 items-center justify-center rounded-full border border-border text-text-secondary transition-colors hover:bg-surface-soft disabled:pointer-events-none disabled:opacity-40"
            >
              <Minus aria-hidden="true" className="size-3.5" />
            </button>
            <span className="w-9 text-center text-sm font-semibold text-text-primary tabular-nums">
              {level}%
            </span>
            <button
              type="button"
              disabled={!enabled}
              onClick={() => setLevel(level + STEP)}
              aria-label="Increase noise filtering level"
              className="flex size-8 items-center justify-center rounded-full border border-border text-text-secondary transition-colors hover:bg-surface-soft disabled:pointer-events-none disabled:opacity-40"
            >
              <Plus aria-hidden="true" className="size-3.5" />
            </button>
          </div>
        </div>
        <p className="mt-2.5 text-xs text-text-muted">
          Saves your preferred level. Real-time audio noise cancellation on SANAD Glasses is a
          future hardware integration — this control doesn&apos;t process live audio yet.
        </p>
      </div>
    </section>
  );
}
