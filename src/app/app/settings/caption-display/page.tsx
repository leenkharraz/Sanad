import type { Metadata } from "next";
import { CaptionDisplayScreen } from "@/features/settings/caption-display-screen";

export const metadata: Metadata = { title: "Caption Display — SANAD" };

export default function CaptionDisplayPage() {
  return <CaptionDisplayScreen />;
}
