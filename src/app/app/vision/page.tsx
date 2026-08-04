import type { Metadata } from "next";
import { Eye } from "lucide-react";
import { PhaseStub } from "@/components/feedback/phase-stub";

export const metadata: Metadata = { title: "Vision Assistance — SANAD" };

export default function VisionPage() {
  return (
    <div className="pt-4">
      <PhaseStub
        icon={Eye}
        title="Vision Assistance"
        description="Camera preview, object detection, OCR reading, distance alerts, and reading mode will appear here."
        phase="Phase 3"
      />
    </div>
  );
}
