"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type SpeechSynthesisStatus =
  | "checking"
  | "unsupported"
  | "idle"
  | "speaking"
  | "error";

interface SpeakOptions {
  voice?: SpeechSynthesisVoice | null;
  rate?: number;
  pitch?: number;
  lang?: string;
}

/** Thin wrapper around the real browser `SpeechSynthesis` API — no fake TTS. */
export function useSpeechSynthesis() {
  const [status, setStatus] = useState<SpeechSynthesisStatus>("checking");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [error, setError] = useState<string | null>(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    // One-time feature-detection on mount — not a response to state/props,
    // so this isn't the render-cascade pattern react-hooks/set-state-in-effect
    // warns about.
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("unsupported");
      return;
    }
    setStatus("idle");

    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = useCallback((text: string, options?: SpeakOptions) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setStatus("unsupported");
      return;
    }
    const trimmed = text.trim();
    if (!trimmed) return;

    cancelledRef.current = false;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(trimmed);
    if (options?.voice) utterance.voice = options.voice;
    if (options?.lang) utterance.lang = options.lang;
    utterance.rate = options?.rate ?? 1;
    utterance.pitch = options?.pitch ?? 1;

    utterance.onstart = () => {
      setStatus("speaking");
      setError(null);
    };
    utterance.onend = () => {
      setStatus((prev) => (prev === "error" ? prev : "idle"));
    };
    utterance.onerror = (event) => {
      if (cancelledRef.current || event.error === "interrupted" || event.error === "canceled") {
        setStatus("idle");
        return;
      }
      setStatus("error");
      setError("Something went wrong while speaking. Try again.");
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    cancelledRef.current = true;
    window.speechSynthesis.cancel();
    setStatus("idle");
  }, []);

  return { status, voices, error, speak, stop };
}
