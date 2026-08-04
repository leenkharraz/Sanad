import type { Metadata } from "next";
import { Ear } from "lucide-react";
import { PhaseStub } from "@/components/feedback/phase-stub";

export const metadata: Metadata = { title: "Hearing Assistance — SANAD" };

export default function HearingPage() {
  return (
    <div className="pt-4">
      <PhaseStub
        icon={Ear}
        title="Hearing Assistance"
        description="Live captions, name-call alerts, environmental sound alerts, noise filtering, and translation will appear here."
        phase="Phase 2–3"
      />
    </div>
  );
}
