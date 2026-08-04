"use client";

import { GreetingHeader } from "@/features/home/greeting-header";
import { GlassesStatusCard } from "@/features/home/glasses-status-card";
import { AuraShortcutCard } from "@/features/home/aura-shortcut-card";
import { ModeCard } from "@/features/home/mode-card";
import { RecentActivitySection } from "@/features/home/recent-activity-section";
import { orderModesByPreference } from "@/data/home-modes";
import { usePreferences } from "@/components/providers/preferences-provider";

export default function HomePage() {
  const { preferences } = usePreferences();
  const modes = orderModesByPreference(preferences.accessibilityNeeds);

  return (
    <div className="space-y-6 pb-4">
      <GreetingHeader />

      <section className="grid gap-3 sm:grid-cols-2">
        <GlassesStatusCard />
        <AuraShortcutCard />
      </section>

      <section aria-labelledby="modes-heading" className="space-y-2.5">
        <h2 id="modes-heading" className="text-sm font-semibold text-text-primary">
          Your modes
        </h2>
        <div className="space-y-2.5">
          {modes.map((mode) => (
            <ModeCard
              key={mode.need}
              mode={mode}
              selected={preferences.accessibilityNeeds.includes(mode.need)}
            />
          ))}
        </div>
      </section>

      <RecentActivitySection />
    </div>
  );
}
