"use client";

import Link from "next/link";
import { Glasses, ChevronRight } from "lucide-react";
import { useTranslation } from "@/i18n/use-translation";

export function GlassesStatusCard() {
  const { t } = useTranslation();

  return (
    <Link
      href="/app/glasses"
      className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3.5 transition-colors hover:bg-surface-soft"
    >
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent-secondary text-brand-700">
        <Glasses aria-hidden="true" className="size-6" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-text-primary">{t("home.glasses.title")}</p>
        <p className="flex items-center gap-1.5 text-xs text-text-muted">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-text-muted" />
          {t("common.notConnected")}
        </p>
      </div>
      <ChevronRight aria-hidden="true" className="size-5 shrink-0 text-text-muted rtl:-scale-x-100" />
    </Link>
  );
}
