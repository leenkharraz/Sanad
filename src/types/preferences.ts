export type AccessibilityNeed = "hearing" | "vision" | "speech";

export type AppLanguage = "en" | "ar";

export type ThemeMode = "light" | "dark" | "calm";

export type FontSize = "default" | "large" | "extra-large";

export interface UserPreferences {
  accessibilityNeeds: AccessibilityNeed[];
  language: AppLanguage;
  themeMode: ThemeMode;
  fontSize: FontSize;
  onboardingComplete: boolean;
  personalizationComplete: boolean;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  accessibilityNeeds: [],
  language: "en",
  themeMode: "light",
  fontSize: "default",
  onboardingComplete: false,
  personalizationComplete: false,
};
