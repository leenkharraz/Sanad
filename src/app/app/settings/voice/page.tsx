import type { Metadata } from "next";
import { VoiceSettingsScreen } from "@/features/settings/voice-settings-screen";

export const metadata: Metadata = { title: "Voice Settings — SANAD" };

export default function VoiceSettingsPage() {
  return <VoiceSettingsScreen />;
}
