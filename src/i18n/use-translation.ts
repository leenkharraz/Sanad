"use client";

import { useCallback, useMemo } from "react";
import { usePreferences } from "@/components/providers/preferences-provider";
import { en, type Translations } from "@/i18n/en";
import { ar } from "@/i18n/ar";
import type { Leaves } from "@/i18n/types";
import type { AppLanguage } from "@/types/preferences";

export type TranslationKey = Leaves<Translations>;

const DICTIONARIES: Record<AppLanguage, Translations> = { en, ar };

function lookup(dict: unknown, key: string): unknown {
  return key.split(".").reduce<unknown>((node, part) => {
    if (node && typeof node === "object" && part in node) {
      return (node as Record<string, unknown>)[part];
    }
    return undefined;
  }, dict);
}

function interpolate(value: string, vars?: Record<string, string | number>): string {
  if (!vars) return value;
  return value.replace(/\{(\w+)\}/g, (match, name) => {
    const replacement = vars[name];
    return replacement === undefined ? match : String(replacement);
  });
}

/**
 * The single translation source of truth for the app. Reads the user's
 * saved language preference (PreferencesProvider) — never guesses from the
 * browser — and returns a `t()` lookup plus the current lang.
 *
 * Deliberately does NOT expose a `dir` value: the app's structural layout
 * stays dir="ltr" in both languages (see PreferencesProvider and
 * tokens.css) — there is no per-component "which way should this flex
 * container face" decision to make here.
 */
export function useTranslation() {
  const { preferences } = usePreferences();
  const lang = preferences.language;
  const dict = DICTIONARIES[lang];

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>): string => {
      const value = lookup(dict, key);
      if (typeof value !== "string") {
        if (process.env.NODE_ENV !== "production") {
          console.warn(`[i18n] Missing or non-string translation for key "${key}"`);
        }
        return key;
      }
      return interpolate(value, vars);
    },
    [dict]
  );

  const tList = useCallback(
    (key: TranslationKey): string[] => {
      const value = lookup(dict, key);
      return Array.isArray(value) ? value : [];
    },
    [dict]
  );

  return useMemo(() => ({ t, tList, lang }), [t, tList, lang]);
}
