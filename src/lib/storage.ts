export const STORAGE_KEYS = {
  session: "sanad.session",
  preferences: "sanad.preferences",
  quickPhrases: "sanad.quickPhrases",
  emergencyContacts: "sanad.emergencyContacts",
  emergencyMessage: "sanad.emergencyMessage",
  accounts: "sanad.accounts",
  profiles: "sanad.profiles",
} as const;

/** Scope used for all per-user storage before anyone is signed in (or for
 * the demo user's namesake — no, demo has its own id). Lets language/theme
 * picked pre-auth carry over naturally into a brand-new account instead of
 * resetting, and lets signed-out screens (Welcome, Sign in) still render
 * with whatever the device was last set to. */
export const GUEST_SCOPE = "guest";

/** Namespaces a base storage key by user (or GUEST_SCOPE), so each account
 * gets its own preferences/quick phrases/emergency contacts — switching
 * accounts must never leak one user's data into another's. */
export function scopedKey(base: string, scope: string): string {
  return `${base}.${scope}`;
}

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
