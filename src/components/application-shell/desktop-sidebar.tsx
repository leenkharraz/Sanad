"use client";

import Link from "next/link";
import { APP_NAV_ITEMS } from "@/data/nav-items";
import { SidebarNavItem } from "@/components/navigation/nav-item";
import { EmergencyQuickAction } from "@/components/navigation/emergency-quick-action";
import { BrandLogo } from "@/components/design-system/brand-logo";
import { useTranslation } from "@/i18n/use-translation";

export function DesktopSidebar() {
  const { t } = useTranslation();

  return (
    <aside
      aria-label={t("nav.sidebarLabel")}
      className="safe-top hidden w-64 shrink-0 flex-col border-r border-border bg-surface md:flex"
    >
      <div className="flex items-center gap-2 px-5 py-6">
        <Link href="/app/home" className="flex items-center">
          <BrandLogo variant="full" className="h-9 w-auto" />
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {APP_NAV_ITEMS.map((item) => (
          <SidebarNavItem key={item.href} item={item} />
        ))}
      </nav>
      <div className="px-3 pb-6">
        <EmergencyQuickAction className="w-full justify-center" />
      </div>
    </aside>
  );
}
