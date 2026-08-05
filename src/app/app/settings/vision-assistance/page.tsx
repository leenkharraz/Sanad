import type { Metadata } from "next";
import { VisionAssistanceScreen } from "@/features/settings/vision-assistance-screen";

export const metadata: Metadata = { title: "Vision Assistance — SANAD" };

export default function VisionAssistanceSettingsPage() {
  return <VisionAssistanceScreen />;
}
