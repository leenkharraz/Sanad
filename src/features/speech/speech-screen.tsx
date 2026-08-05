"use client";

import { useState } from "react";
import { Volume2, Square, TriangleAlert } from "lucide-react";
import { ScreenHeader } from "@/components/navigation/screen-header";
import { SegmentedControl } from "@/components/design-system/segmented-control";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { QuickPhraseEditor } from "@/features/speech/quick-phrase-editor";
import { usePreferences } from "@/components/providers/preferences-provider";
import { useTranslation } from "@/i18n/use-translation";

// The TTS *spoken* language is a separate preference from the app's UI
// language (see useTranslation) — switching the interface to Arabic must
// never silently change what language SANAD speaks aloud, and vice versa.
type SpeechLang = "en" | "ar";

export function SpeechScreen() {
  const { status, voices, error, speak, stop } = useSpeechSynthesis();
  const { preferences } = usePreferences();
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [lang, setLang] = useState<SpeechLang>("en");
  // Seeded once from the default saved in Settings > Voice Settings — this
  // screen can still override them for the current session without writing
  // back, so the two screens never fight over which one owns the value.
  const [voiceURI, setVoiceURI] = useState<string>(() => preferences.voiceSettings.voiceURI);
  const [rate, setRate] = useState(() => preferences.voiceSettings.speechRate);
  const [pitch, setPitch] = useState(1);

  const langVoices = voices.filter((v) => v.lang.toLowerCase().startsWith(lang));
  // Falls back to the first available voice for the language whenever the
  // stored voiceURI doesn't match (e.g. right after switching languages),
  // computed at render time instead of synced via effect.
  const selectedVoice =
    langVoices.find((v) => v.voiceURI === voiceURI) ?? langVoices[0] ?? null;

  function handleSpeak() {
    speak(text, { voice: selectedVoice, rate, pitch, lang: lang === "ar" ? "ar-SA" : "en-US" });
  }

  return (
    <div className="space-y-6 pb-4">
      <ScreenHeader title={t("speech.title")} backHref="/app/home" />

      {status === "unsupported" && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-2xl border border-warning/30 bg-warning-soft px-4 py-3 text-sm text-warning"
        >
          <TriangleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <p>{t("speech.unsupportedBanner")}</p>
        </div>
      )}

      <SegmentedControl<SpeechLang>
        ariaLabel={t("speech.languageLabel")}
        value={lang}
        onChange={setLang}
        options={[
          { value: "en", label: "English" },
          { value: "ar", label: "العربية" },
        ]}
      />

      <div className="space-y-1.5">
        <Label htmlFor="tts-text">{t("speech.textToSpeakLabel")}</Label>
        <textarea
          id="tts-text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={6}
          placeholder={t("speech.textPlaceholder")}
          dir="auto"
          className="w-full resize-none rounded-2xl border border-border bg-surface px-4 py-3 text-base text-text-primary placeholder:text-text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-danger">
          {t("speech.errors.generic")}
        </p>
      )}

      <div className="grid grid-cols-3 gap-2.5">
        <Button
          type="button"
          size="touch"
          className="col-span-2"
          onClick={handleSpeak}
          disabled={status === "unsupported" || !text.trim()}
        >
          <Volume2 aria-hidden="true" className="size-4" />
          {status === "speaking" ? t("speech.speaking") : t("speech.speak")}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="touch"
          onClick={stop}
          disabled={status !== "speaking"}
        >
          <Square aria-hidden="true" className="size-4" />
          {t("speech.stop")}
        </Button>
      </div>
      <button
        type="button"
        onClick={() => setText("")}
        disabled={!text}
        className="min-h-11 text-sm font-medium text-text-secondary underline-offset-4 hover:text-text-primary hover:underline disabled:pointer-events-none disabled:opacity-50"
      >
        {t("speech.clearText")}
      </button>

      <section className="space-y-2">
        <Label htmlFor="tts-voice">{t("speech.voiceLabel")}</Label>
        {langVoices.length > 0 ? (
          <select
            id="tts-voice"
            dir="ltr"
            value={selectedVoice?.voiceURI ?? ""}
            onChange={(event) => setVoiceURI(event.target.value)}
            className="h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-start text-sm text-text-primary"
          >
            {langVoices.map((voice) => (
              <option key={voice.voiceURI} value={voice.voiceURI}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        ) : (
          <p className="text-sm text-text-muted">
            {status === "checking"
              ? t("speech.loadingVoices")
              : t("speech.noVoicesFound", {
                  language: lang === "ar" ? t("speech.languageNameArabic") : t("speech.languageNameEnglish"),
                })}
          </p>
        )}
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="tts-rate">{t("speech.speedLabel")}</Label>
          <span className="text-sm font-medium text-text-secondary tabular-nums">
            {rate.toFixed(1)}x
          </span>
        </div>
        <input
          id="tts-rate"
          type="range"
          min={0.5}
          max={2}
          step={0.1}
          value={rate}
          onChange={(event) => setRate(Number(event.target.value))}
          className="w-full accent-primary"
        />
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="tts-pitch">{t("speech.pitchLabel")}</Label>
          <span className="text-sm font-medium text-text-secondary tabular-nums">
            {pitch.toFixed(1)}
          </span>
        </div>
        <input
          id="tts-pitch"
          type="range"
          min={0}
          max={2}
          step={0.1}
          value={pitch}
          onChange={(event) => setPitch(Number(event.target.value))}
          className="w-full accent-primary"
        />
      </section>

      <QuickPhraseEditor
        onSpeak={(phraseText) =>
          speak(phraseText, { voice: selectedVoice, rate, pitch, lang: lang === "ar" ? "ar-SA" : "en-US" })
        }
      />
    </div>
  );
}
