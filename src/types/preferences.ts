export type AccessibilityNeed = "hearing" | "vision" | "speech";

export type AppLanguage = "en" | "ar";

export type ThemeMode = "light" | "dark" | "calm";

export type FontSize = "default" | "large" | "extra-large";

export interface NoiseFilterSettings {
  enabled: boolean;
  /** 0-100. UI-only today — see home noise filter card for the "future integration" label. */
  level: number;
}

export type CaptionPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "center-left"
  | "center"
  | "center-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type CaptionColor = "black" | "white" | "yellow" | "red" | "blue" | "green";

export interface CaptionDisplaySettings {
  fontSize: FontSize;
  position: CaptionPosition;
  /** 0-100. */
  backgroundOpacity: number;
  backgroundColor: CaptionColor;
  textColor: CaptionColor;
}

export type EmotionSensitivity = "low" | "high";

export interface EmotionUrgencySettings {
  enabled: boolean;
  sensitivity: EmotionSensitivity;
}

export interface VoiceSettings {
  /** SpeechSynthesisVoice.voiceURI of the saved default — empty until a real voice is chosen. */
  voiceURI: string;
  speechRate: number;
}

export interface TranslationPreference {
  from: AppLanguage;
  to: AppLanguage;
}

export interface VisionAssistanceSettings {
  objectDetection: boolean;
  distanceAlerts: boolean;
  readingMode: boolean;
}

export interface UserPreferences {
  accessibilityNeeds: AccessibilityNeed[];
  language: AppLanguage;
  themeMode: ThemeMode;
  fontSize: FontSize;
  onboardingComplete: boolean;
  personalizationComplete: boolean;
  noiseFilter: NoiseFilterSettings;
  captionDisplay: CaptionDisplaySettings;
  emotionUrgency: EmotionUrgencySettings;
  voiceSettings: VoiceSettings;
  translation: TranslationPreference;
  visionAssistance: VisionAssistanceSettings;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  accessibilityNeeds: [],
  language: "en",
  themeMode: "light",
  fontSize: "default",
  onboardingComplete: false,
  personalizationComplete: false,
  noiseFilter: { enabled: false, level: 40 },
  captionDisplay: {
    fontSize: "default",
    position: "bottom-center",
    backgroundOpacity: 70,
    backgroundColor: "black",
    textColor: "white",
  },
  emotionUrgency: { enabled: false, sensitivity: "high" },
  voiceSettings: { voiceURI: "", speechRate: 1 },
  translation: { from: "en", to: "ar" },
  visionAssistance: { objectDetection: false, distanceAlerts: false, readingMode: false },
};
