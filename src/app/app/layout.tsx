"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/application-shell/app-shell";
import { useSession } from "@/components/providers/session-provider";
import { useTranslation } from "@/i18n/use-translation";

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { session, isLoaded } = useSession();
  const { t } = useTranslation();

  useEffect(() => {
    if (isLoaded && !session) {
      router.replace("/welcome");
    }
  }, [isLoaded, session, router]);

  if (!isLoaded || !session) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <span className="sr-only" role="status">
          {t("common.loadingSanad")}
        </span>
        <div className="size-8 animate-spin rounded-full border-2 border-border border-t-brand-800 motion-reduce:animate-none" />
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
