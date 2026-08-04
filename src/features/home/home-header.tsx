"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSession } from "@/components/providers/session-provider";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getGreeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function HomeHeader() {
  const { session } = useSession();
  const [now, setNow] = useState<Date | null>(null);
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
  }, []);

  const name = session?.user.name ?? "there";

  return (
    <header className="flex items-center justify-between gap-3 pt-4">
      <Link href="/app/profile" className="flex min-w-0 items-center gap-3">
        <Avatar className="size-11">
          <AvatarFallback className="bg-brand-800 text-sm font-semibold text-text-inverse">
            {session ? initials(name) : "?"}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="text-xs font-medium text-text-secondary">
            {now ? getGreeting(now.getHours()) : "Hello"}
          </p>
          <p className="truncate text-lg font-semibold text-text-primary">{name}</p>
        </div>
      </Link>

      <div className="flex shrink-0 items-center gap-1.5">
        <Link
          href="/app/aura"
          aria-label="Ask Aura"
          className="flex size-11 items-center justify-center rounded-full bg-gold-soft text-brand-800 transition-opacity hover:opacity-85"
        >
          <Sparkles aria-hidden="true" className="size-5" />
        </Link>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotice((v) => !v)}
            aria-label="Notifications"
            aria-expanded={showNotice}
            className="flex size-11 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-soft hover:text-text-primary"
          >
            <Bell aria-hidden="true" className="size-5" />
          </button>
          {showNotice && (
            <div
              role="status"
              className="absolute right-0 z-10 mt-2 w-56 rounded-xl border border-border bg-surface p-3 text-xs text-text-secondary shadow-lg"
            >
              No new notifications yet.
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
