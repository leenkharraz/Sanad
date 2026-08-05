import type { TranslationKey } from "@/i18n/use-translation";

/** Maps mock-auth/accounts-store's stable error codes to translation keys,
 * so that layer stays UI/language-agnostic and every form shows the
 * message in the user's current language.
 *
 * UNKNOWN_ACCOUNT and INCORRECT_PASSWORD deliberately share one message —
 * never reveal which part was wrong, standard practice even for a
 * prototype, and it also means "never silently sign in anyway" applies
 * equally to both cases. */
const AUTH_ERROR_KEYS: Record<string, TranslationKey> = {
  UNKNOWN_ACCOUNT: "auth.validation.incorrectCredentials",
  INCORRECT_PASSWORD: "auth.validation.incorrectCredentials",
  DUPLICATE_ACCOUNT: "auth.validation.duplicateAccount",
};

export function authErrorKey(error: unknown): TranslationKey {
  if (error instanceof Error && AUTH_ERROR_KEYS[error.message]) {
    return AUTH_ERROR_KEYS[error.message];
  }
  return "auth.validation.genericError";
}
