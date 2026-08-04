import { Ear, Eye, MessageCircle, type LucideIcon } from "lucide-react";
import type { AccessibilityNeed } from "@/types/preferences";

export interface HomeMode {
  need: AccessibilityNeed;
  title: string;
  href: string;
  icon: LucideIcon;
  features: string[];
}

export const HOME_MODES: HomeMode[] = [
  {
    need: "hearing",
    title: "Hear",
    href: "/app/hearing",
    icon: Ear,
    features: [
      "Live captions",
      "Name-call alert",
      "Sound alerts",
      "Noise filtering",
      "Translation",
    ],
  },
  {
    need: "vision",
    title: "See",
    href: "/app/vision",
    icon: Eye,
    features: [
      "Object detection",
      "Object recognition",
      "OCR reading",
      "Distance alerts",
      "Reading mode",
    ],
  },
  {
    need: "speech",
    title: "Speak",
    href: "/app/speech",
    icon: MessageCircle,
    features: [
      "Text-to-speech",
      "Quick phrases",
      "Voice selection",
      "Speech speed",
      "Saved phrases",
    ],
  },
];

export function orderModesByPreference(selected: AccessibilityNeed[]): HomeMode[] {
  return [...HOME_MODES].sort((a, b) => {
    const aSelected = selected.includes(a.need);
    const bSelected = selected.includes(b.need);
    if (aSelected === bSelected) return 0;
    return aSelected ? -1 : 1;
  });
}
