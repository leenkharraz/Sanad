"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useQuickPhrases } from "@/components/providers/quick-phrases-provider";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { useTranslation } from "@/i18n/use-translation";
import { localizedQuickPhraseText } from "@/i18n/localized-defaults";

export function QuickPhrasesRow() {
  const { phrases } = useQuickPhrases();
  const { speak, status } = useSpeechSynthesis();
  const { t, lang } = useTranslation();
  const favorites = phrases.filter((p) => p.favorite);
  const rest = phrases.filter((p) => !p.favorite);
  const visible = [...favorites, ...rest].slice(0, 4);

  return (
    <section aria-labelledby="quick-phrases-heading" className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h2 id="quick-phrases-heading" className="text-sm font-semibold text-text-primary">
          {t("home.quickPhrases.title")}
        </h2>
        <Link href="/app/speech" className="text-xs font-medium text-brand-700 hover:underline">
          {t("home.quickPhrases.manage")}
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {visible.map((phrase) => {
          const text = localizedQuickPhraseText(phrase, lang);
          return (
            <button
              key={phrase.id}
              type="button"
              onClick={() => speak(text)}
              disabled={status === "unsupported"}
              className="rounded-xl border border-border bg-surface px-3.5 py-3 text-start text-sm font-medium text-text-primary transition-colors hover:bg-surface-soft disabled:pointer-events-none disabled:opacity-50"
            >
              {text}
            </button>
          );
        })}
        {visible.length === 0 && (
          <Link
            href="/app/speech"
            className="col-span-2 flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-border px-3.5 py-3 text-sm text-text-muted"
          >
            <Plus aria-hidden="true" className="size-4" /> {t("home.quickPhrases.addPrompt")}
          </Link>
        )}
      </div>

      {status === "unsupported" && (
        <p className="text-xs text-text-muted">{t("home.quickPhrases.unsupported")}</p>
      )}
    </section>
  );
}
