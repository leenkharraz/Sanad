"use client";

import { Sparkles } from "lucide-react";
import { PhaseStub } from "@/components/feedback/phase-stub";
import { useTranslation } from "@/i18n/use-translation";

export default function AuraPage() {
  const { t } = useTranslation();
  return (
    <div className="pt-4">
      <PhaseStub
        icon={Sparkles}
        title={t("stubs.aura.title")}
        description={t("stubs.aura.description")}
      />
    </div>
  );
}
