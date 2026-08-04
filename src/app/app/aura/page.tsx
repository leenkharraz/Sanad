import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { PhaseStub } from "@/components/feedback/phase-stub";

export const metadata: Metadata = { title: "Aura — SANAD" };

export default function AuraPage() {
  return (
    <div className="pt-4">
      <PhaseStub
        icon={Sparkles}
        title="Aura Assistant"
        description="A conversational assistant to help you communicate will appear here, with clearly labeled mocked responses."
        phase="Phase 3"
      />
    </div>
  );
}
