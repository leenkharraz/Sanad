"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AmbientGlow } from "@/components/design-system/ambient-glow";
import { useSession } from "@/components/providers/session-provider";
import { useNotifications } from "@/components/providers/notifications-provider";
import { useTranslation } from "@/i18n/use-translation";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function HomeHeader() {
  const { session } = useSession();
  const { unreadCount } = useNotifications();
  const { t } = useTranslation();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
  }, []);

  const name = session?.user.name ?? "there";
  const greeting = now
    ? now.getHours() < 12
      ? t("home.greetingMorning")
      : now.getHours() < 18
        ? t("home.greetingAfternoon")
        : t("home.greetingEvening")
    : t("home.greetingFallback");

  return (
    <header className="relative -mx-4 overflow-hidden px-4 pt-4 pb-2 md:-mx-10 md:px-10">
      <AmbientGlow variant="soft" />
      <div className="relative flex items-center justify-between gap-3">
        <Link href="/app/profile" className="flex min-w-0 items-center gap-3">
          <Avatar className="size-11 ring-2 ring-surface">
            <AvatarFallback className="bg-brand-800 text-sm font-semibold text-text-inverse">
              {session ? initials(name) : "?"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-xs font-medium text-text-secondary">{greeting}</p>
            <p className="truncate text-lg font-semibold text-text-primary">{name}</p>
          </div>
        </Link>

        <div className="flex shrink-0 items-center gap-1.5">
          <Link
            href="/app/aura"
            aria-label={t("home.askAura")}
            className="flex size-11 items-center justify-center rounded-full bg-gold-soft text-brand-800 transition-opacity hover:opacity-85"
          >
            <Sparkles aria-hidden="true" className="size-5" />
          </Link>
          <Link
            href="/app/notifications"
            aria-label={
              unreadCount > 0
                ? `${t("home.notifications")} (${unreadCount})`
                : t("home.notifications")
            }
            className="relative flex size-11 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-soft hover:text-text-primary"
          >
            <Bell aria-hidden="true" className="size-5" />
            {unreadCount > 0 && (
              <span
                aria-hidden="true"
                className="absolute end-2 top-2 size-2 rounded-full bg-danger ring-2 ring-background"
              />
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
