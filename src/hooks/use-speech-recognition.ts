"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type RecognitionStatus =
  | "checking"
  | "unsupported"
  | "idle"
  | "listening"
  | "denied"
  | "error";

function getRecognitionCtor(): (new () => SpeechRecognition) | undefined {
  if (typeof window === "undefined") return undefined;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition;
}

/** Thin wrapper around the real browser `SpeechRecognition` API — no fake transcripts. */
export function useSpeechRecognition() {
  const [status, setStatus] = useState<RecognitionStatus>("checking");
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // One-time feature-detection on mount — see the same pattern/rationale
    // in use-speech-synthesis.ts.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus(getRecognitionCtor() ? "idle" : "unsupported");
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  const start = useCallback((lang: string = "en-US") => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) {
      setStatus("unsupported");
      return;
    }

    const recognition = new Ctor();
    recognition.lang = lang;
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }
      if (final.trim()) {
        setTranscript((prev) => (prev ? `${prev} ${final.trim()}` : final.trim()));
      }
      setInterimTranscript(interim);
    };

    recognition.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "permission-denied") {
        setStatus("denied");
        setError("mic-denied");
        return;
      }
      if (event.error === "no-speech") {
        setError("no-speech");
        return;
      }
      setStatus("error");
      setError("generic");
    };

    recognition.onend = () => {
      setInterimTranscript("");
      setStatus((prev) => (prev === "denied" || prev === "error" ? prev : "idle"));
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
      setStatus("listening");
      setError(null);
    } catch {
      setStatus("error");
      setError("start-failed");
    }
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setStatus("idle");
  }, []);

  const clear = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
  }, []);

  return { status, transcript, interimTranscript, error, start, stop, clear };
}
