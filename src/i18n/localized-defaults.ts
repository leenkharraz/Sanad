import type { AppLanguage } from "@/types/preferences";

/**
 * SANAD's four seeded Quick Phrases, in both languages, keyed by their
 * stable default id. Used ONLY to decide what to *display* for a phrase
 * that still matches an unmodified default — never to rewrite storage.
 * A user's own custom phrases (random ids) or hand-edited defaults (text
 * no longer matching either canonical wording) are never touched here.
 */
export const DEFAULT_QUICK_PHRASE_TEXT: Record<string, Record<AppLanguage, string>> = {
  "qp-thank-you": { en: "Thank you", ar: "شكرًا لك" },
  "qp-need-help": { en: "I need help", ar: "أحتاج إلى المساعدة" },
  "qp-restroom": { en: "Where is the restroom?", ar: "أين دورة المياه؟" },
  "qp-lost": { en: "I am lost", ar: "لقد ضللت الطريق" },
};

export function localizedQuickPhraseText(
  phrase: { id: string; text: string },
  lang: AppLanguage
): string {
  const known = DEFAULT_QUICK_PHRASE_TEXT[phrase.id];
  if (!known) return phrase.text;
  const isUnmodifiedDefault = phrase.text === known.en || phrase.text === known.ar;
  return isUnmodifiedDefault ? known[lang] : phrase.text;
}

/**
 * The Emergency message textarea starts pre-filled with a template the
 * user is expected to edit. Once anything has ever been saved for it
 * (including the untouched default, on first visit), that becomes the
 * user's own content and must never be swapped by a later language
 * change — see emergency-screen.tsx for where this is applied.
 */
export const DEFAULT_EMERGENCY_MESSAGE_TEXT: Record<AppLanguage, string> = {
  en: "I am in danger. This is my location.",
  ar: "أنا في خطر. هذا هو موقعي.",
};
