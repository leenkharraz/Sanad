"use client";

import { Eye } from "lucide-react";
import { PhaseStub } from "@/components/feedback/phase-stub";
import { useTranslation } from "@/i18n/use-translation";

export default function VisionPage() {
  const { t } = useTranslation();
  return (
    <div className="pt-4">
      <PhaseStub
        icon={Eye}
        title={t("stubs.vision.title")}
        description={t("stubs.vision.description")}
      />
    </div>
  );
}
