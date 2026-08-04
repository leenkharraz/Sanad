export type AccessibilityNeed = "hearing" | "vision" | "speech";

export type AppLanguage = "en" | "ar";

export type ThemeMode = "light" | "dark" | "calm";

export type FontSize = "default" | "large" | "extra-large";

export interface NoiseFilterSettings {
  enabled: boolean;
  /** 0-100. UI-only today — see home noise filter card for the "future integration" label. */
  level: number;
}

export interface UserPreferences {
  accessibilityNeeds: AccessibilityNeed[];
  language: AppLanguage;
  themeMode: ThemeMode;
  fontSize: FontSize;
  onboardingComplete: boolean;
  personalizationComplete: boolean;
  noiseFilter: NoiseFilterSettings;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  accessibilityNeeds: [],
  language: "en",
  themeMode: "light",
  fontSize: "default",
  onboardingComplete: false,
  personalizationComplete: false,
  noiseFilter: { enabled: false, level: 40 },
};
