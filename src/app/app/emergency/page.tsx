import type { Metadata } from "next";
import { EmergencyScreen } from "@/features/emergency/emergency-screen";

export const metadata: Metadata = { title: "Emergency SOS — SANAD" };

export default function EmergencyPage() {
  return <EmergencyScreen />;
}
