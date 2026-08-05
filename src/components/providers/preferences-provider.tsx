"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  DEFAULT_PREFERENCES,
  type AccessibilityNeed,
  type UserPreferences,
} from "@/types/preferences";
import { STORAGE_KEYS, readStorage, writeStorage, scopedKey, GUEST_SCOPE } from "@/lib/storage";
import { useSession } from "@/components/providers/session-provider";

interface PreferencesContextValue {
  preferences: UserPreferences;
  isLoaded: boolean;
  updatePreferences: (patch: Partial<UserPreferences>) => void;
  toggleAccessibilityNeed: (need: AccessibilityNeed) => void;
  resetPreferences: () => void;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const { session, isLoaded: sessionLoaded } = useSession();
  const scope = session?.user.id ?? GUEST_SCOPE;
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoaded, setIsLoaded] = useState(false);
  const hydratedScopeRef = useRef<string | null>(null);

  useEffect(() => {
    // Waits for the session to resolve first, then loads THAT scope's own
    // preferences (per-account, so switching accounts never leaks one
    // user's theme/language/onboarding-state into another's). A brand-new
    // account with no saved preferences yet starts from whatever was active
    // as a guest (e.g. language picked pre-auth) instead of hard-resetting.
    if (!sessionLoaded) return;
    if (hydratedScopeRef.current === scope) return;
    hydratedScopeRef.current = scope;

    const stored = readStorage<UserPreferences>(scopedKey(STORAGE_KEYS.preferences, scope));
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreferences({ ...DEFAULT_PREFERENCES, ...stored });
    } else if (scope !== GUEST_SCOPE) {
      const guest = readStorage<UserPreferences>(scopedKey(STORAGE_KEYS.preferences, GUEST_SCOPE));
      setPreferences(guest ? { ...DEFAULT_PREFERENCES, ...guest } : DEFAULT_PREFERENCES);
    } else {
      setPreferences(DEFAULT_PREFERENCES);
    }
    setIsLoaded(true);
  }, [scope, sessionLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    writeStorage(scopedKey(STORAGE_KEYS.preferences, scope), preferences);
  }, [preferences, isLoaded, scope]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", preferences.themeMode === "dark");
    root.classList.toggle("calm", preferences.themeMode === "calm");
    root.dataset.fontSize = preferences.fontSize;
    root.lang = preferences.language;
    // The app's structural layout (nav, sidebar, cards, headers) stays LTR
    // in both languages — only text content renders RTL where Arabic
    // content calls for it (see globals.css). Never toggle this to "rtl".
    root.dir = "ltr";

    const themeColor = preferences.themeMode === "dark" ? "#1B1B1B" : "#FAF7F0";
    document
      .querySelectorAll('meta[name="theme-color"]')
      .forEach((meta) => meta.setAttribute("content", themeColor));
  }, [preferences.themeMode, preferences.fontSize, preferences.language]);

  const updatePreferences = useCallback((patch: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...patch }));
  }, []);

  const toggleAccessibilityNeed = useCallback((need: AccessibilityNeed) => {
    setPreferences((prev) => {
      const has = prev.accessibilityNeeds.includes(need);
      return {
        ...prev,
        accessibilityNeeds: has
          ? prev.accessibilityNeeds.filter((item) => item !== need)
          : [...prev.accessibilityNeeds, need],
      };
    });
  }, []);

  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
  }, []);

  const value = useMemo(
    () => ({
      preferences,
      isLoaded,
      updatePreferences,
      toggleAccessibilityNeed,
      resetPreferences,
    }),
    [preferences, isLoaded, updatePreferences, toggleAccessibilityNeed, resetPreferences]
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences(): PreferencesContextValue {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
}
