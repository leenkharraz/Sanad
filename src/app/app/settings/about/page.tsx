import type { Metadata } from "next";
import { AboutScreen } from "@/features/settings/about-screen";

export const metadata: Metadata = { title: "About SANAD — SANAD" };

export default function AboutSanadPage() {
  return <AboutScreen />;
}
