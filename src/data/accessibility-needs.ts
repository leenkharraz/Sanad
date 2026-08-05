import { Ear, Eye, MessageCircle, type LucideIcon } from "lucide-react";
import type { AccessibilityNeed } from "@/types/preferences";
import type { TranslationKey } from "@/i18n/use-translation";

export interface AccessibilityNeedOption {
  id: AccessibilityNeed;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  functionsKey: TranslationKey;
  icon: LucideIcon;
}

export const ACCESSIBILITY_NEED_OPTIONS: AccessibilityNeedOption[] = [
  {
    id: "hearing",
    titleKey: "onboarding.needs.hearing.title",
    descriptionKey: "onboarding.needs.hearing.description",
    functionsKey: "onboarding.needs.hearing.functions",
    icon: Ear,
  },
  {
    id: "vision",
    titleKey: "onboarding.needs.vision.title",
    descriptionKey: "onboarding.needs.vision.description",
    functionsKey: "onboarding.needs.vision.functions",
    icon: Eye,
  },
  {
    id: "speech",
    titleKey: "onboarding.needs.speech.title",
    descriptionKey: "onboarding.needs.speech.description",
    functionsKey: "onboarding.needs.speech.functions",
    icon: MessageCircle,
  },
];
