"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DEFAULT_PREFERENCES,
  type AccessibilityNeed,
  type UserPreferences,
} from "@/types/preferences";
import { STORAGE_KEYS, readStorage, writeStorage } from "@/lib/storage";

interface PreferencesContextValue {
  preferences: UserPreferences;
  isLoaded: boolean;
  updatePreferences: (patch: Partial<UserPreferences>) => void;
  toggleAccessibilityNeed: (need: AccessibilityNeed) => void;
  resetPreferences: () => void;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // One-time hydration from localStorage, which does not exist during SSR.
    // This intentionally runs once on mount, not in response to state/props,
    // so it is not the render-cascade pattern react-hooks/set-state-in-effect
    // warns about.
    const stored = readStorage<UserPreferences>(STORAGE_KEYS.preferences);
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreferences({ ...DEFAULT_PREFERENCES, ...stored });
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    writeStorage(STORAGE_KEYS.preferences, preferences);
  }, [preferences, isLoaded]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", preferences.themeMode === "dark");
    root.classList.toggle("calm", preferences.themeMode === "calm");
    root.dataset.fontSize = preferences.fontSize;
    root.lang = preferences.language;
    root.dir = preferences.language === "ar" ? "rtl" : "ltr";

    const themeColor = preferences.themeMode === "dark" ? "#1E1E1E" : "#FAF0E6";
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
