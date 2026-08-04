import type { Metadata } from "next";
import { TriangleAlert } from "lucide-react";
import { PhaseStub } from "@/components/feedback/phase-stub";

export const metadata: Metadata = { title: "Emergency SOS — SANAD" };

export default function EmergencyPage() {
  return (
    <div className="pt-4">
      <PhaseStub
        icon={TriangleAlert}
        title="Emergency SOS"
        description="Trusted contacts, location sharing, and simulated alert sending will appear here. No real messages are sent by SANAD today."
        phase="Phase 2"
      />
    </div>
  );
}
