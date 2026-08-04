import type { Metadata } from "next";
import { HearingScreen } from "@/features/hearing/hearing-screen";

export const metadata: Metadata = { title: "Live Transcription — SANAD" };

export default function HearingPage() {
  return <HearingScreen />;
}
