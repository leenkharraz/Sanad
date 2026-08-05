import type { Metadata } from "next";
import { PrivacyScreen } from "@/features/settings/privacy-screen";

export const metadata: Metadata = { title: "Privacy — SANAD" };

export default function PrivacySettingsPage() {
  return <PrivacyScreen />;
}
