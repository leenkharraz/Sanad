export const STORAGE_KEYS = {
  session: "sanad.session",
  preferences: "sanad.preferences",
  quickPhrases: "sanad.quickPhrases",
  emergencyContacts: "sanad.emergencyContacts",
  emergencyMessage: "sanad.emergencyMessage",
} as const;

export function readStorage<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function writeStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage can be unavailable (private browsing, quota); the
    // prototype degrades to in-memory state for the current session only.
  }
}

export function clearStorage(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}
