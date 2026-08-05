"use client";

import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSession } from "@/components/providers/session-provider";
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

export default function ProfilePage() {
  const { session } = useSession();
  const { t } = useTranslation();
  const user = session?.user;

  return (
    <div className="space-y-6 pb-4 pt-4">
      <h1 className="text-2xl font-semibold tracking-tight text-text-primary">{t("profile.title")}</h1>

      <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface px-4 py-5">
        <Avatar className="size-14 ring-2 ring-surface-soft">
          <AvatarFallback className="bg-brand-800 text-base font-semibold text-text-inverse">
            {user ? initials(user.name) : "?"}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate font-semibold text-text-primary">{user?.name}</p>
          <p className="truncate text-sm text-text-secondary">
            <bdi dir="ltr">{user?.email}</bdi>
          </p>
          {user?.isDemo && (
            <span className="mt-1 inline-block rounded-full bg-gold-soft px-2 py-0.5 text-[0.7rem] font-medium text-brand-800">
              {t("profile.demoAccount")}
            </span>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-border bg-surface px-4 py-5 text-sm text-text-secondary">
        <p>{t("profile.privacyNotice")}</p>
      </div>

      <Link
        href="/app/settings"
        className="block text-center text-sm font-medium text-brand-700 hover:underline"
      >
        {t("profile.managePreferences")}
      </Link>
    </div>
  );
}
