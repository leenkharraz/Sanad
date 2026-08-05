/** Extended personal/medical info, in the spirit of SANAD's original
 * concept of the Profile screen as a personal ID card. Every field starts
 * empty — never pre-filled with any specific person's real data — and is
 * only ever shown for the account that actually saved it. */
export interface SanadProfile {
  dateOfBirth: string;
  heightCm: string;
  bloodType: string;
  allergies: string;
  emergencyNote: string;
}

export const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

export const DEFAULT_PROFILE: SanadProfile = {
  dateOfBirth: "",
  heightCm: "",
  bloodType: "",
  allergies: "",
  emergencyNote: "",
};
