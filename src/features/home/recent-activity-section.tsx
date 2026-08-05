"use client";

import { History } from "lucide-react";
import { useTranslation } from "@/i18n/use-translation";

export function RecentActivitySection() {
  const { t } = useTranslation();

  return (
    <section aria-labelledby="recent-activity-heading" className="space-y-2.5">
      <h2 id="recent-activity-heading" className="text-sm font-semibold text-text-primary">
        {t("home.recentActivity.title")}
      </h2>
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border bg-surface px-4 py-8 text-center">
        <History aria-hidden="true" className="size-6 text-text-muted" />
        <p className="text-sm text-text-muted">{t("home.recentActivity.empty")}</p>
      </div>
    </section>
  );
}
