"use client";

import Link from "next/link";
import { Ear, Eye, MessageCircle, Sparkles, ChevronRight } from "lucide-react";
import { useTranslation, type TranslationKey } from "@/i18n/use-translation";

const LINKS: {
  href: string;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  icon: typeof Ear;
  accent: string;
}[] = [
  {
    href: "/app/hearing",
    titleKey: "assist.hearingTitle",
    descriptionKey: "assist.hearingDescription",
    icon: Ear,
    accent: "bg-accent-hearing",
  },
  {
    href: "/app/vision",
    titleKey: "assist.visionTitle",
    descriptionKey: "assist.visionDescription",
    icon: Eye,
    accent: "bg-surface-soft",
  },
  {
    href: "/app/speech",
    titleKey: "assist.speechTitle",
    descriptionKey: "assist.speechDescription",
    icon: MessageCircle,
    accent: "bg-accent-speech",
  },
];

export default function AssistPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-5 pb-4 pt-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">{t("assist.title")}</h1>
        <p className="mt-1 text-sm text-text-secondary">{t("assist.subtitle")}</p>
      </div>

      <Link
        href="/app/aura"
        className="flex items-center gap-3.5 rounded-2xl bg-gold-soft px-4 py-4 text-brand-800 transition-opacity hover:opacity-90"
      >
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-surface/70 text-brand-800">
          <Sparkles aria-hidden="true" className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{t("assist.auraTitle")}</p>
          <p className="text-xs opacity-80">{t("assist.auraSubtitle")}</p>
        </div>
        <ChevronRight aria-hidden="true" className="size-5 shrink-0 rtl:-scale-x-100" />
      </Link>

      <div className="space-y-2.5">
        {LINKS.map(({ href, titleKey, descriptionKey, icon: Icon, accent }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3.5 rounded-2xl border border-border bg-surface px-4 py-4 transition-colors hover:bg-surface-soft"
          >
            <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${accent} text-brand-700`}>
              <Icon aria-hidden="true" className="size-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-text-primary">{t(titleKey)}</p>
              <p className="truncate text-xs text-text-muted">{t(descriptionKey)}</p>
            </div>
            <ChevronRight aria-hidden="true" className="size-5 shrink-0 text-text-muted rtl:-scale-x-100" />
          </Link>
        ))}
      </div>
    </div>
  );
}
