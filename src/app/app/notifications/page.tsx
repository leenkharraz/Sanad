import type { Metadata } from "next";
import { NotificationsScreen } from "@/features/notifications/notifications-screen";

export const metadata: Metadata = { title: "Notifications — SANAD" };

export default function NotificationsPage() {
  return <NotificationsScreen />;
}
