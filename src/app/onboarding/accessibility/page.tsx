import type { Metadata } from "next";
import { AccessibilityNeedsStep } from "@/features/onboarding/accessibility-needs-step";

export const metadata: Metadata = { title: "Accessibility needs — SANAD" };

export default function AccessibilityOnboardingPage() {
  return <AccessibilityNeedsStep />;
}
