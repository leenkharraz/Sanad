import type { Metadata } from "next";
import { NotificationSettingsScreen } from "@/features/settings/notification-settings-screen";

export const metadata: Metadata = { title: "Notification Settings — SANAD" };

export default function NotificationSettingsPage() {
  return <NotificationSettingsScreen />;
}
