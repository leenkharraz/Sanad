"use client";

import Link from "next/link";
import { Captions, Volume2 } from "lucide-react";
import { useTranslation } from "@/i18n/use-translation";

export function PrimaryActions() {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 gap-3">
      <Link
        href="/app/hearing"
        className="group flex flex-col items-start gap-4 rounded-2xl bg-primary px-4 py-5 text-primary-foreground shadow-[0_10px_28px_-16px_rgba(59,42,32,0.55)] transition-transform hover:opacity-95 active:scale-[0.98]"
      >
        <span className="flex size-11 items-center justify-center rounded-xl bg-primary-foreground/15">
          <Captions aria-hidden="true" className="size-5.5" />
        </span>
        <span>
          <span className="block text-sm font-semibold">{t("home.primaryActions.startCaptioning")}</span>
          <span className="mt-0.5 block text-xs opacity-80">
            {t("home.primaryActions.startCaptioningSubtitle")}
          </span>
        </span>
      </Link>
      <Link
        href="/app/speech"
        className="flex flex-col items-start gap-4 rounded-2xl border border-border bg-surface px-4 py-5 text-text-primary transition-colors hover:bg-surface-soft active:scale-[0.98]"
      >
        <span className="flex size-11 items-center justify-center rounded-xl bg-accent-speech text-brand-700">
          <Volume2 aria-hidden="true" className="size-5.5" />
        </span>
        <span>
          <span className="block text-sm font-semibold">{t("home.primaryActions.textToSpeech")}</span>
          <span className="mt-0.5 block text-xs text-text-muted">
            {t("home.primaryActions.textToSpeechSubtitle")}
          </span>
        </span>
      </Link>
    </div>
  );
}
