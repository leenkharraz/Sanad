"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Glasses,
  TriangleAlert,
  Captions,
  Smile,
  Mic,
  Languages,
  Eye,
  Lock,
  Info,
  Bell,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SegmentedControl } from "@/components/design-system/segmented-control";
import { AccessibilityNeedsEditor } from "@/features/settings/accessibility-needs-editor";
import { AppTextDisplaySection } from "@/features/settings/app-text-display-section";
import { usePreferences } from "@/components/providers/preferences-provider";
import { useSession } from "@/components/providers/session-provider";
import { useNotifications } from "@/components/providers/notifications-provider";
import { useTranslation, type TranslationKey } from "@/i18n/use-translation";

interface MoreSettingsRow {
  titleKey: TranslationKey;
  icon: LucideIcon;
  href: string;
}

const MORE_SETTINGS_ROWS: MoreSettingsRow[] = [
  { titleKey: "settings.rows.captionDisplay", icon: Captions, href: "/app/settings/caption-display" },
  { titleKey: "settings.rows.emotionUrgency", icon: Smile, href: "/app/settings/emotion-urgency" },
  { titleKey: "settings.rows.voiceSettings", icon: Mic, href: "/app/settings/voice" },
  { titleKey: "settings.rows.translation", icon: Languages, href: "/app/settings/translation" },
  { titleKey: "settings.rows.visionAssistance", icon: Eye, href: "/app/settings/vision-assistance" },
  { titleKey: "settings.rows.privacy", icon: Lock, href: "/app/settings/privacy" },
  { titleKey: "settings.rows.aboutSanad", icon: Info, href: "/app/settings/about" },
  { titleKey: "settings.rows.notifications", icon: Bell, href: "/app/settings/notifications" },
];

export default function SettingsPage() {
  const router = useRouter();
  const { preferences, updatePreferences } = usePreferences();
  const { signOut } = useSession();
  const { addNotification } = useNotifications();
  const { t } = useTranslation();

  function handleSignOut() {
    signOut();
    router.replace("/welcome");
  }

  return (
    <div className="space-y-6 pb-4 pt-4">
      <h1 className="text-2xl font-semibold tracking-tight text-text-primary">{t("settings.title")}</h1>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-text-primary">{t("settings.accessibilityNeedsTitle")}</h2>
        <div className="rounded-2xl border border-border bg-surface px-2 py-1.5">
          <AccessibilityNeedsEditor />
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-text-primary">{t("settings.languageTitle")}</h2>
        <SegmentedControl
          ariaLabel={t("settings.languageTitle")}
          value={preferences.language}
          onChange={(language) => {
            updatePreferences({ language });
            addNotification("languageChanged");
          }}
          options={[
            { value: "en", label: "English" },
            { value: "ar", label: "العربية" },
          ]}
        />
      </section>

      <AppTextDisplaySection />

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-text-primary">{t("settings.deviceSafetyTitle")}</h2>
        <div className="divide-y divide-border rounded-2xl border border-border bg-surface">
          <Link
            href="/app/glasses"
            className="flex min-h-14 items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-soft"
          >
            <Glasses aria-hidden="true" className="size-5 text-brand-700" />
            <span className="flex-1 text-sm font-medium text-text-primary">{t("settings.smartGlasses")}</span>
            <ChevronRight aria-hidden="true" className="size-4 text-text-muted" />
          </Link>
          <Link
            href="/app/emergency"
            className="flex min-h-14 items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-soft"
          >
            <TriangleAlert aria-hidden="true" className="size-5 text-danger" />
            <span className="flex-1 text-sm font-medium text-text-primary">{t("settings.emergency")}</span>
            <ChevronRight aria-hidden="true" className="size-4 text-text-muted" />
          </Link>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-text-primary">{t("settings.moreSettingsTitle")}</h2>
        <div className="divide-y divide-border rounded-2xl border border-border bg-surface">
          {MORE_SETTINGS_ROWS.map(({ titleKey, icon: Icon, href }) => (
            <Link
              key={titleKey}
              href={href}
              className="flex min-h-14 items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-soft"
            >
              <Icon aria-hidden="true" className="size-5 text-brand-700" />
              <span className="flex-1 text-sm font-medium text-text-primary">{t(titleKey)}</span>
              <ChevronRight aria-hidden="true" className="size-4 text-text-muted" />
            </Link>
          ))}
        </div>
      </section>

      <Button
        type="button"
        variant="outline"
        size="touch"
        className="w-full text-danger hover:bg-danger-soft"
        onClick={handleSignOut}
      >
        <LogOut aria-hidden="true" className="size-4" />
        {t("settings.signOut")}
      </Button>
    </div>
  );
}
