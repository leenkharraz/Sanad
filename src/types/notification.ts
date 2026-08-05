export type NotificationCategory = "safety" | "accessibility" | "device" | "general";

/** Every kind of notification SANAD can generate — always from a real
 * in-app action, never a fabricated event (no simulated hardware alerts). */
export type NotificationType =
  | "profileUpdated"
  | "accessibilityUpdated"
  | "emergencyContactAdded"
  | "emergencyContactRemoved"
  | "captionSettingsUpdated"
  | "voiceSettingsUpdated"
  | "languageChanged";

export const NOTIFICATION_CATEGORY: Record<NotificationType, NotificationCategory> = {
  profileUpdated: "general",
  accessibilityUpdated: "accessibility",
  emergencyContactAdded: "safety",
  emergencyContactRemoved: "safety",
  captionSettingsUpdated: "device",
  voiceSettingsUpdated: "device",
  languageChanged: "general",
};

export interface SanadNotification {
  id: string;
  type: NotificationType;
  /** Interpolation params for the notification's description, e.g. a
   * trusted contact's name — never free text, so it always re-renders
   * correctly in whichever language is active when it's viewed. */
  params?: Record<string, string>;
  createdAt: string;
  read: boolean;
}

export interface NotificationPreferences {
  safety: boolean;
  accessibility: boolean;
  device: boolean;
  general: boolean;
}

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  safety: true,
  accessibility: true,
  device: true,
  general: true,
};
