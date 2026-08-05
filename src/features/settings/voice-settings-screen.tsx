"use client";

import Link from "next/link";
import { TriangleAlert, Volume2, ChevronRight } from "lucide-react";
import { ScreenHeader } from "@/components/navigation/screen-header";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { usePreferences } from "@/components/providers/preferences-provider";
import { useTranslation } from "@/i18n/use-translation";

/** Only labels a voice Female/Male when the browser's own voice name says so
 * (e.g. "Microsoft Zira - English (United States)") — the Web Speech API
 * exposes no real gender field, so anything else would be a fabricated tag. */
function detectVoiceGender(name: string): "female" | "male" | null {
  if (/female/i.test(name)) return "female";
  if (/male/i.test(name)) return "male";
  return null;
}

export function VoiceSettingsScreen() {
  const { status, voices, speak } = useSpeechSynthesis();
  const { preferences, updatePreferences } = usePreferences();
  const { t } = useTranslation();
  const settings = preferences.voiceSettings;

  function patch(next: Partial<typeof settings>) {
    updatePreferences({ voiceSettings: { ...settings, ...next } });
  }

  const selectedVoice = voices.find((v) => v.voiceURI === settings.voiceURI) ?? voices[0] ?? null;

  function handlePreview() {
    speak(t("settingsPages.voice.previewText"), {
      voice: selectedVoice,
      rate: settings.speechRate,
      lang: selectedVoice?.lang,
    });
  }

  return (
    <div className="space-y-6 pb-4">
      <ScreenHeader title={t("settings.rows.voiceSettings")} backHref="/app/settings" />

      {status === "unsupported" && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-2xl border border-warning/30 bg-warning-soft px-4 py-3 text-sm text-warning"
        >
          <TriangleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <p>{t("settingsPages.voice.unsupportedBanner")}</p>
        </div>
      )}

      <section className="space-y-2">
        <Label htmlFor="default-voice">{t("settingsPages.voice.voice")}</Label>
        {voices.length > 0 ? (
          <select
            id="default-voice"
            dir="ltr"
            value={selectedVoice?.voiceURI ?? ""}
            onChange={(event) => patch({ voiceURI: event.target.value })}
            className="h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-start text-sm text-text-primary"
          >
            {voices.map((voice) => {
              const gender = detectVoiceGender(voice.name);
              const genderLabel = gender
                ? ` — ${gender === "female" ? t("settingsPages.voice.female") : t("settingsPages.voice.male")}`
                : "";
              return (
                <option key={voice.voiceURI} value={voice.voiceURI}>
                  {voice.name} ({voice.lang}){genderLabel}
                </option>
              );
            })}
          </select>
        ) : (
          <p className="text-sm text-text-muted">
            {status === "checking" ? t("settingsPages.voice.loadingVoices") : t("settingsPages.voice.noVoicesFound")}
          </p>
        )}
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="default-speed">{t("settingsPages.voice.speechSpeed")}</Label>
          <span className="text-sm font-medium text-text-secondary tabular-nums">
            {settings.speechRate.toFixed(1)}x
          </span>
        </div>
        <input
          id="default-speed"
          type="range"
          min={0.5}
          max={2}
          step={0.1}
          value={settings.speechRate}
          onChange={(event) => patch({ speechRate: Number(event.target.value) })}
          className="w-full accent-primary"
        />
      </section>

      <Button
        type="button"
        variant="outline"
        size="touch"
        className="w-full"
        onClick={handlePreview}
        disabled={status === "unsupported"}
      >
        <Volume2 aria-hidden="true" className="size-4" />
        {t("settingsPages.voice.previewVoice")}
      </Button>

      <Link
        href="/app/speech"
        className="flex min-h-14 items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 transition-colors hover:bg-surface-soft"
      >
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-text-primary">{t("settingsPages.voice.quickPhrases")}</p>
          <p className="text-xs text-text-secondary">{t("settingsPages.voice.quickPhrasesHint")}</p>
        </div>
        <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-text-muted" />
      </Link>
    </div>
  );
}
