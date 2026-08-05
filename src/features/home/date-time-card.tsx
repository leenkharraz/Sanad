"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { useTranslation } from "@/i18n/use-translation";

// Gregorian calendar + Western digits explicitly, in both languages — the
// app has never had Hijri or Arabic-Indic numeral support, and localizing
// the language must not silently introduce a different date/number system.
const LOCALE: Record<string, string> = {
  en: "en-US-u-ca-gregory-nu-latn",
  ar: "ar-SA-u-ca-gregory-nu-latn",
};

export function DateTimeCard() {
  const [now, setNow] = useState<Date | null>(null);
  const { t, lang } = useTranslation();
  const locale = LOCALE[lang] ?? "en-US";

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3.5">
      <div>
        <p className="text-xs font-medium text-text-secondary">
          {now ? new Intl.DateTimeFormat(locale, { weekday: "long" }).format(now) : "—"}
        </p>
        <p className="mt-0.5 text-sm font-semibold text-text-primary">
          {now
            ? new Intl.DateTimeFormat(locale, { month: "long", day: "numeric", year: "numeric" }).format(now)
            : t("home.loadingDate")}
        </p>
      </div>
      <div className="flex items-center gap-1.5 rounded-xl bg-accent-secondary px-3 py-2 text-sm font-semibold text-text-primary tabular-nums">
        <Clock aria-hidden="true" className="size-4" />
        <bdi dir="ltr">
          {now ? new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit" }).format(now) : "--:--"}
        </bdi>
      </div>
    </div>
  );
}
