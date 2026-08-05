"use client";

import Link from "next/link";
import { Mic, Camera, MapPin, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScreenHeader } from "@/components/navigation/screen-header";
import { usePermissionStatus, type PermissionStatusValue } from "@/hooks/use-permission-status";
import { useTranslation, type TranslationKey } from "@/i18n/use-translation";

const STATUS_KEY: Record<PermissionStatusValue, TranslationKey> = {
  granted: "settingsPages.privacy.status.granted",
  denied: "settingsPages.privacy.status.denied",
  prompt: "settingsPages.privacy.status.prompt",
  unsupported: "settingsPages.privacy.status.unsupported",
};

const STATUS_CLASS: Record<PermissionStatusValue, string> = {
  granted: "bg-success-soft text-success",
  denied: "bg-danger-soft text-danger",
  prompt: "bg-warning-soft text-warning",
  unsupported: "bg-surface-soft text-text-muted",
};

function PermissionRow({
  icon: Icon,
  titleKey,
  hintKey,
  status,
}: {
  icon: typeof Mic;
  titleKey: TranslationKey;
  hintKey: TranslationKey;
  status: PermissionStatusValue;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-soft text-brand-700">
        <Icon aria-hidden="true" className="size-4.5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-text-primary">{t(titleKey)}</p>
        <p className="text-xs text-text-secondary">{t(hintKey)}</p>
      </div>
      <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-xs font-medium", STATUS_CLASS[status])}>
        {t(STATUS_KEY[status])}
      </span>
    </div>
  );
}

export function PrivacyScreen() {
  const { t } = useTranslation();
  const micStatus = usePermissionStatus("microphone");
  const cameraStatus = usePermissionStatus("camera");
  const geoStatus = usePermissionStatus("geolocation");

  return (
    <div className="space-y-6 pb-4">
      <ScreenHeader title={t("settings.rows.privacy")} backHref="/app/settings" />

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-text-primary">{t("settingsPages.privacy.permissionsTitle")}</h2>
        <div className="divide-y divide-border rounded-2xl border border-border bg-surface">
          <PermissionRow
            icon={Mic}
            titleKey="settingsPages.privacy.microphone"
            hintKey="settingsPages.privacy.microphoneHint"
            status={micStatus}
          />
          <PermissionRow
            icon={Camera}
            titleKey="settingsPages.privacy.camera"
            hintKey="settingsPages.privacy.cameraHint"
            status={cameraStatus}
          />
          <PermissionRow
            icon={MapPin}
            titleKey="settingsPages.privacy.location"
            hintKey="settingsPages.privacy.locationHint"
            status={geoStatus}
          />
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-text-primary">{t("settingsPages.privacy.dataTitle")}</h2>
        <div className="divide-y divide-border rounded-2xl border border-border bg-surface">
          <Link
            href="/app/emergency"
            className="flex min-h-14 items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-soft"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-text-primary">{t("settingsPages.privacy.emergencyContacts")}</p>
              <p className="text-xs text-text-secondary">{t("settingsPages.privacy.emergencyContactsHint")}</p>
            </div>
            <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-text-muted" />
          </Link>
          <Link
            href="/app/profile"
            className="flex min-h-14 items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-soft"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-text-primary">{t("settingsPages.privacy.profileInformation")}</p>
              <p className="text-xs text-text-secondary">{t("settingsPages.privacy.profileInformationHint")}</p>
            </div>
            <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-text-muted" />
          </Link>
        </div>
      </section>
    </div>
  );
}
