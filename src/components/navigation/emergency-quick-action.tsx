"use client";

import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n/use-translation";

export function EmergencyQuickAction({ className }: { className?: string }) {
  const { t } = useTranslation();

  return (
    <Link
      href="/app/emergency"
      aria-label={t("home.emergency.title")}
      className={cn(
        "flex h-11 items-center gap-1.5 rounded-full border border-danger/30 bg-danger-soft px-3.5 text-sm font-semibold text-danger transition-colors hover:bg-danger hover:text-white",
        className
      )}
    >
      <TriangleAlert aria-hidden="true" className="size-4" />
      SOS
    </Link>
  );
}
