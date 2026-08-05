import type { TranslationKey } from "@/i18n/use-translation";

/** Maps mock-auth's stable error codes to translation keys, so mock-auth.ts
 * stays UI/language-agnostic and every form shows the message in the
 * user's current language. */
const AUTH_ERROR_KEYS: Record<string, TranslationKey> = {
  INCORRECT_CREDENTIALS: "auth.validation.incorrectCredentials",
  COULD_NOT_CREATE_ACCOUNT: "auth.validation.couldNotCreateAccount",
  ENTER_EMAIL_FIRST: "auth.validation.enterEmailFirst",
};

export function authErrorKey(error: unknown): TranslationKey {
  if (error instanceof Error && AUTH_ERROR_KEYS[error.message]) {
    return AUTH_ERROR_KEYS[error.message];
  }
  return "auth.validation.genericError";
}
