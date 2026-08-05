"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Ear, Eye, MessageCircle } from "lucide-react";
import { BrandLogo } from "@/components/design-system/brand-logo";
import { AmbientGlow } from "@/components/design-system/ambient-glow";
import { Button } from "@/components/ui/button";
import { useSession } from "@/components/providers/session-provider";
import { DEMO_USER } from "@/lib/mock-auth";
import { useTranslation } from "@/i18n/use-translation";

export default function WelcomePage() {
  const router = useRouter();
  const { signIn } = useSession();
  const { t } = useTranslation();

  function handleContinueAsDemo() {
    signIn(DEMO_USER);
    router.push("/onboarding/accessibility");
  }

  return (
    <div className="relative flex min-h-dvh flex-1 flex-col overflow-hidden bg-background">
      <AmbientGlow variant="soft" />

      <div className="safe-top relative flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
        <BrandLogo variant="full" priority className="h-24 w-auto" />
        <p className="mt-3 max-w-xs text-balance text-base text-text-secondary">
          {t("welcome.tagline")}
        </p>

        <ul className="mt-8 flex w-full max-w-xs flex-col gap-2.5 text-start">
          <li className="flex items-center gap-3 rounded-xl bg-surface-soft px-3.5 py-2.5">
            <Ear aria-hidden="true" className="size-5 shrink-0 text-brand-700" />
            <span className="text-sm text-text-secondary">{t("welcome.featureCaptions")}</span>
          </li>
          <li className="flex items-center gap-3 rounded-xl bg-surface-soft px-3.5 py-2.5">
            <Eye aria-hidden="true" className="size-5 shrink-0 text-brand-700" />
            <span className="text-sm text-text-secondary">{t("welcome.featureVision")}</span>
          </li>
          <li className="flex items-center gap-3 rounded-xl bg-surface-soft px-3.5 py-2.5">
            <MessageCircle aria-hidden="true" className="size-5 shrink-0 text-brand-700" />
            <span className="text-sm text-text-secondary">{t("welcome.featureSpeech")}</span>
          </li>
        </ul>
      </div>

      <div className="safe-bottom safe-x relative mx-auto flex w-full max-w-sm flex-col gap-3 px-6 pb-8">
        <Button asChild size="touch" className="w-full">
          <Link href="/auth/sign-in">{t("welcome.signIn")}</Link>
        </Button>
        <Button asChild variant="outline" size="touch" className="w-full">
          <Link href="/auth/sign-up">{t("welcome.createAccount")}</Link>
        </Button>
        <button
          type="button"
          onClick={handleContinueAsDemo}
          className="min-h-11 text-sm font-medium text-text-secondary underline-offset-4 hover:text-text-primary hover:underline"
        >
          {t("welcome.continueAsDemo")}
        </button>
      </div>
    </div>
  );
}
