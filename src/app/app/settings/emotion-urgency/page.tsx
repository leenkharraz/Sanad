import type { Metadata } from "next";
import { EmotionUrgencyScreen } from "@/features/settings/emotion-urgency-screen";

export const metadata: Metadata = { title: "Emotion & Urgency — SANAD" };

export default function EmotionUrgencyPage() {
  return <EmotionUrgencyScreen />;
}
