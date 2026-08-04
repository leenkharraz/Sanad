"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Trash2, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScreenHeader } from "@/components/navigation/screen-header";
import { Button } from "@/components/ui/button";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { Waveform } from "@/features/hearing/waveform";

const DEMO_LINES = [
  "This is a demo transcript — your browser doesn't support live speech recognition.",
  "Try the latest Chrome or Edge on desktop or Android for real live transcription.",
  "Everything else on this screen is fully functional once recognition is available.",
];

export function HearingScreen() {
  const { status, transcript, interimTranscript, error, start, stop, clear } =
    useSpeechRecognition();
  const [demoActive, setDemoActive] = useState(false);
  const [demoText, setDemoText] = useState("");
  const demoTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (demoTimer.current) clearInterval(demoTimer.current);
    };
  }, []);

  function runDemo() {
    setDemoText("");
    setDemoActive(true);
    let index = 0;
    demoTimer.current = setInterval(() => {
      setDemoText((prev) => (prev ? `${prev} ${DEMO_LINES[index]}` : DEMO_LINES[index]));
      index += 1;
      if (index >= DEMO_LINES.length && demoTimer.current) {
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

  return (
    <div className="space-y-6 pb-4">
      <ScreenHeader title="Live Transcription" backHref="/app/home" />

      {status === "unsupported" && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-2xl border border-warning/30 bg-warning-soft px-4 py-3 text-sm text-warning"
        >
          <TriangleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <p>
            Live speech recognition isn&apos;t supported in this browser. You can try an honest
            demo below — it plays a scripted transcript, it does not listen to your microphone.
          </p>
        </div>
      )}

      {status === "denied" && error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-2xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger"
        >
          <TriangleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface px-4 py-5">
        <div
          className={cn(
            "flex size-14 shrink-0 items-center justify-center rounded-full transition-colors",
            listening || demoActive ? "bg-danger text-white" : "bg-surface-soft text-brand-700"
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
              ? "Listening…"
              : status === "denied"
                ? "Microphone blocked"
                : status === "unsupported"
                  ? "Demo mode available"
                  : status === "error"
                    ? "Something went wrong"
                    : "Not listening"}
          </p>
          <div className="mt-1.5">
            <Waveform active={listening || demoActive} />
          </div>
        </div>
      </div>

      {error && status !== "denied" && (
        <p role="alert" className="text-sm text-danger">
          {error}
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
              ? "Transcript will appear here once you start the demo."
              : "Transcript will appear here once you start listening."}
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
            {demoActive ? "Stop demo" : "Try demo mode"}
          </Button>
        ) : (
          <>
            <Button
              type="button"
              size="touch"
              onClick={() => start("en-US")}
              disabled={listening}
            >
              Start Listening
            </Button>
            <Button type="button" variant="outline" size="touch" onClick={stop} disabled={!listening}>
              Stop Listening
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
        Clear transcript
      </button>
    </div>
  );
}
