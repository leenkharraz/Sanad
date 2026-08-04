"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { NavItem as NavItemData } from "@/data/nav-items";

function isActivePath(pathname: string, href: string) {
  if (href === "/app/home") return pathname === href;
  return pathname.startsWith(href);
}

export function BottomNavItem({ item }: { item: NavItemData }) {
  const pathname = usePathname();
  const active = isActivePath(pathname, item.href);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex min-h-11 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 text-[0.7rem] font-medium transition-colors",
        active ? "bg-surface-soft text-brand-700" : "text-text-muted hover:text-text-secondary"
      )}
    >
      <Icon aria-hidden="true" className="size-5" strokeWidth={active ? 2.4 : 1.8} />
      <span>{item.label}</span>
    </Link>
  );
}

export function SidebarNavItem({ item }: { item: NavItemData }) {
  const pathname = usePathname();
  const active = isActivePath(pathname, item.href);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
        active
          ? "bg-secondary text-secondary-foreground"
          : "text-text-secondary hover:bg-surface-soft hover:text-text-primary"
      )}
    >
      <Icon aria-hidden="true" className="size-5 shrink-0" strokeWidth={active ? 2.4 : 2} />
      <span>{item.label}</span>
    </Link>
  );
}
