"use client";

import { HomeHeader } from "@/features/home/home-header";
import { DateTimeCard } from "@/features/home/date-time-card";
import { PrimaryActions } from "@/features/home/primary-actions";
import { NoiseFilterCard } from "@/features/home/noise-filter-card";
import { QuickPhrasesRow } from "@/features/home/quick-phrases-row";
import { EmergencySection } from "@/features/home/emergency-section";
import { GlassesStatusCard } from "@/features/home/glasses-status-card";
import { RecentActivitySection } from "@/features/home/recent-activity-section";

export default function HomePage() {
  return (
    <div className="space-y-5 pb-4">
      <HomeHeader />
      <DateTimeCard />
      <PrimaryActions />
      <NoiseFilterCard />
      <QuickPhrasesRow />
      <EmergencySection />
      <GlassesStatusCard />
      <RecentActivitySection />
    </div>
  );
}
