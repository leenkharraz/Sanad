"use client";

import { Glasses } from "lucide-react";
import { PhaseStub } from "@/components/feedback/phase-stub";
import { useTranslation } from "@/i18n/use-translation";

export default function GlassesPage() {
  const { t } = useTranslation();
  return (
    <div className="pt-4">
      <PhaseStub
        icon={Glasses}
        title={t("stubs.glasses.title")}
        description={t("stubs.glasses.description")}
      />
    </div>
  );
}
