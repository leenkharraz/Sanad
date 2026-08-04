import type { Metadata } from "next";
import { Glasses } from "lucide-react";
import { PhaseStub } from "@/components/feedback/phase-stub";

export const metadata: Metadata = { title: "Smart Glasses — SANAD" };

export default function GlassesPage() {
  return (
    <div className="pt-4">
      <PhaseStub
        icon={Glasses}
        title="Smart Glasses"
        description="Pairing, battery status, and caption synchronization for a SANAD Glasses device will appear here. No real Bluetooth connection exists yet."
        phase="Phase 3"
      />
    </div>
  );
}
