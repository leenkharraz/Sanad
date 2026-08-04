export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
}

/** Fictional demo contacts — not sourced from any real user data. */
export const DEFAULT_EMERGENCY_CONTACTS: EmergencyContact[] = [
  { id: "ec-1", name: "Layla Ahmad", relationship: "Sister", phone: "+1 (555) 019-2231" },
  { id: "ec-2", name: "Omar Al-Faisal", relationship: "Friend", phone: "+1 (555) 048-7765" },
];

export const DEFAULT_EMERGENCY_MESSAGE = "I am in danger. This is my location.";
