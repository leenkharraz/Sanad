import type { Metadata } from "next";
import { PersonalizationStep } from "@/features/onboarding/personalization-step";

export const metadata: Metadata = { title: "Personalize — SANAD" };

export default function PersonalizePage() {
  return <PersonalizationStep />;
}
