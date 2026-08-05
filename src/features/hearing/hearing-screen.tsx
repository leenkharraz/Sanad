"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Trash2, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScreenHeader } from "@/components/navigation/screen-header";
import { Button } from "@/components/ui/button";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { Waveform } from "@/features/hearing/waveform";
import { useTranslation } from "@/i18n/use-translation";

const RECOGNITION_ERROR_KEYS = {
  "mic-denied": "hearing.errors.micDenied",
  "no-speech": "hearing.errors.noSpeech",
  generic: "hearing.errors.generic",
  "start-failed": "hearing.errors.startFailed",
} as const;

export function HearingScreen() {
  const { status, transcript, interimTranscript, error, start, stop, clear } =
    useSpeechRecognition();
  const { t, tList } = useTranslation();
  const [demoActive, setDemoActive] = useState(false);
  const [demoText, setDemoText] = useState("");
  const demoTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (demoTimer.current) clearInterval(demoTimer.current);
    };
  }, []);

  function runDemo() {
    const demoLines = tList("hearing.demoLines");
    setDemoText("");
    setDemoActive(true);
    let index = 0;
    demoTimer.current = setInterval(() => {
      setDemoText((prev) => (prev ? `${prev} ${demoLines[index]}` : demoLines[index]));
      index += 1;
      if (index >= demoLines.length && demoTimer.current) {
        clearInterval(demoTimer.current);
        setDemoActive(false);
      }
    }, 1400);
  }

  function stopDemo() {
    if (demoTimer.current) clearInterval(demoTimer.current);
    setDemoActive(false);
  }

  const listening = status === "listening";
  const shownTranscript = status === "unsupported" ? demoText : transcript;
  const shownInterim = status === "unsupported" ? "" : interimTranscript;
  const errorMessage = error
    ? t(RECOGNITION_ERROR_KEYS[error as keyof typeof RECOGNITION_ERROR_KEYS] ?? "hearing.errors.generic")
    : null;

  return (
    <div className="space-y-6 pb-4">
      <ScreenHeader title={t("hearing.title")} backHref="/app/home" />

      {status === "unsupported" && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-2xl border border-warning/30 bg-warning-soft px-4 py-3 text-sm text-warning"
        >
          <TriangleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <p>{t("hearing.unsupportedBanner")}</p>
        </div>
      )}

      {status === "denied" && errorMessage && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-2xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger"
        >
          <TriangleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface px-4 py-5">
        <div
          className={cn(
            "flex size-14 shrink-0 items-center justify-center rounded-full transition-colors",
            listening || demoActive ? "bg-danger text-white" : "bg-accent-hearing text-brand-700"
          )}
        >
          {listening || demoActive ? (
            <Mic aria-hidden="true" className="size-6" />
          ) : (
            <MicOff aria-hidden="true" className="size-6" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-text-primary" role="status">
            {listening || demoActive
              ? t("hearing.listening")
              : status === "denied"
                ? t("hearing.micBlocked")
                : status === "unsupported"
                  ? t("hearing.demoModeAvailable")
                  : status === "error"
                    ? t("hearing.somethingWrong")
                    : t("hearing.notListening")}
          </p>
          <div className="mt-1.5">
            <Waveform active={listening || demoActive} />
          </div>
        </div>
      </div>

      {errorMessage && status !== "denied" && (
        <p role="alert" className="text-sm text-danger">
          {errorMessage}
        </p>
      )}

      <div
        aria-live="polite"
        className="min-h-40 rounded-2xl border border-border bg-surface px-4 py-4 text-base leading-relaxed text-text-primary"
      >
        {shownTranscript || shownInterim ? (
          <p>
            {shownTranscript}
            {shownInterim && <span className="text-text-muted"> {shownInterim}</span>}
          </p>
        ) : (
          <p className="text-text-muted">
            {status === "unsupported"
              ? t("hearing.transcriptPlaceholderDemo")
              : t("hearing.transcriptPlaceholder")}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {status === "unsupported" ? (
          <Button
            type="button"
            size="touch"
            className="col-span-2"
            onClick={demoActive ? stopDemo : runDemo}
          >
            {demoActive ? t("hearing.stopDemo") : t("hearing.tryDemoMode")}
          </Button>
        ) : (
          <>
            <Button
              type="button"
              size="touch"
              onClick={() => start("en-US")}
              disabled={listening}
            >
              {t("hearing.startListening")}
            </Button>
            <Button type="button" variant="outline" size="touch" onClick={stop} disabled={!listening}>
              {t("hearing.stopListening")}
            </Button>
          </>
        )}
      </div>

      <button
        type="button"
        onClick={() => {
          clear();
          setDemoText("");
        }}
        disabled={!shownTranscript}
        className="flex min-h-11 items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary disabled:pointer-events-none disabled:opacity-50"
      >
        <Trash2 aria-hidden="true" className="size-4" />
        {t("hearing.clearTranscript")}
      </button>
    </div>
  );
}
