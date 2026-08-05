import type { Metadata } from "next";
import { TranslationSettingsScreen } from "@/features/settings/translation-settings-screen";

export const metadata: Metadata = { title: "Translation — SANAD" };

export default function TranslationSettingsPage() {
  return <TranslationSettingsScreen />;
}
