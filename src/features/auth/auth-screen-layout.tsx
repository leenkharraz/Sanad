"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { BrandLogo } from "@/components/design-system/brand-logo";
import { AmbientGlow } from "@/components/design-system/ambient-glow";
import { useTranslation } from "@/i18n/use-translation";

interface AuthScreenLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  backHref?: string;
}

export function AuthScreenLayout({
  title,
  subtitle,
  children,
  backHref = "/welcome",
}: AuthScreenLayoutProps) {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-background">
      {/* Warm blurred decorative top section */}
      <div className="safe-top relative flex shrink-0 flex-col overflow-hidden pb-14">
        <AmbientGlow variant="soft" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-background" />

        <div className="relative flex items-center px-4 py-3">
          <Link
            href={backHref}
            aria-label={t("common.goBack")}
            className="flex size-11 items-center justify-center rounded-full text-text-secondary hover:bg-surface/60 hover:text-text-primary"
          >
            <ChevronLeft aria-hidden="true" className="size-5 rtl:-scale-x-100" />
          </Link>
        </div>

        <div className="relative flex flex-1 items-center justify-center pt-2">
          <BrandLogo variant="full" priority className="h-16 w-auto" />
        </div>
      </div>

      {/* Near-white authentication sheet with large rounded top corners */}
      <div className="relative -mt-8 flex-1 rounded-t-[2rem] bg-surface px-6 pt-8 pb-10 shadow-[0_-8px_24px_-16px_rgba(70,57,48,0.25)]">
        <div className="mx-auto w-full max-w-sm">
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
            {title}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>

          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
