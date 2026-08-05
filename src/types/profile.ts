/** Extended personal/medical info, in the spirit of SANAD's original
 * concept of the Profile screen as a personal ID card. Every field starts
 * empty — never pre-filled with any specific person's real data — and is
 * only ever shown for the account that actually saved it. */
export interface SanadProfile {
  phone: string;
  dateOfBirth: string;
  heightCm: string;
  bloodType: string;
  allergies: string;
  emergencyNote: string;
  /** A user-uploaded photo, stored as a data URL (small prototype scale —
   * no upload backend). Empty until the user picks one; falls back to the
   * initials avatar everywhere it's rendered. */
  avatarDataUrl: string;
}

export const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

export const DEFAULT_PROFILE: SanadProfile = {
  phone: "",
  dateOfBirth: "",
  heightCm: "",
  bloodType: "",
  allergies: "",
  emergencyNote: "",
  avatarDataUrl: "",
};
