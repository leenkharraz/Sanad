import { Ear, Eye, MessageCircle, type LucideIcon } from "lucide-react";
import type { AccessibilityNeed } from "@/types/preferences";

export interface AccessibilityNeedOption {
  id: AccessibilityNeed;
  title: string;
  description: string;
  functions: string[];
  icon: LucideIcon;
}

export const ACCESSIBILITY_NEED_OPTIONS: AccessibilityNeedOption[] = [
  {
    id: "hearing",
    title: "Hearing Assistance",
    description:
      "Provides real-time captions, name-call alerts, environmental sound alerts, noise filtering, translation, and urgency indicators.",
    functions: [
      "Live captions",
      "Name-call alerts",
      "Environmental sound alerts",
      "Noise filtering",
      "Translation",
    ],
    icon: Ear,
  },
  {
    id: "vision",
    title: "Visual Assistance",
    description:
      "Provides object detection, obstacle awareness, OCR reading, distance alerts, navigation support, and environmental information.",
    functions: [
      "Object detection",
      "Obstacle awareness",
      "OCR reading",
      "Distance alerts",
      "Navigation support",
    ],
    icon: Eye,
  },
  {
    id: "speech",
    title: "Speech Assistance",
    description:
      "Provides text-to-speech, custom voices, quick phrases, saved messages, and assisted communication.",
    functions: [
      "Text-to-speech",
      "Custom voices",
      "Quick phrases",
      "Saved messages",
      "Assisted communication",
    ],
    icon: MessageCircle,
  },
];
