import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";
import { PhaseStub } from "@/components/feedback/phase-stub";

export const metadata: Metadata = { title: "Speech Assistance — SANAD" };

export default function SpeechPage() {
  return (
    <div className="pt-4">
      <PhaseStub
        icon={MessageCircle}
        title="Speech Assistance"
        description="Text-to-speech, voice selection, and quick phrases will appear here."
        phase="Phase 2"
      />
    </div>
  );
}
