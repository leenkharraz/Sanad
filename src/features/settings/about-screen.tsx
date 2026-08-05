"use client";

import { Info } from "lucide-react";
import { ScreenHeader } from "@/components/navigation/screen-header";
import { BrandLogo } from "@/components/design-system/brand-logo";
import { useTranslation } from "@/i18n/use-translation";

const APP_VERSION = "0.1.0";

export function AboutScreen() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 pb-4">
      <ScreenHeader title={t("settings.rows.aboutSanad")} backHref="/app/settings" />

      <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface px-6 py-8 text-center">
        <BrandLogo variant="full" className="h-10 w-auto" />
        <p className="max-w-xs text-sm text-text-secondary">{t("welcome.tagline")}</p>
      </div>

      <p className="text-sm leading-relaxed text-text-secondary">
        {t("settingsPages.about.description")}
      </p>

      <div className="flex items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3.5">
        <span className="text-sm font-medium text-text-primary">{t("settingsPages.about.versionLabel")}</span>
        <span dir="ltr" className="text-sm text-text-secondary tabular-nums">
          {APP_VERSION}
        </span>
      </div>

      <div className="flex items-start gap-2.5 rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text-secondary">
        <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-700" />
        <p>{t("settingsPages.about.prototypeNotice")}</p>
      </div>
    </div>
  );
}
