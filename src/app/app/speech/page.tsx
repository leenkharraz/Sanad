import type { Metadata } from "next";
import { SpeechScreen } from "@/features/speech/speech-screen";

export const metadata: Metadata = { title: "Text To Speech — SANAD" };

export default function SpeechPage() {
  return <SpeechScreen />;
}
