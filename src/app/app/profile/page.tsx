"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Pencil,
  Mail,
  KeyRound,
  LogOut,
  ChevronRight,
  Languages,
  Palette,
  CaseSensitive,
  Glasses,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSession } from "@/components/providers/session-provider";
import { usePreferences } from "@/components/providers/preferences-provider";
import { useNotifications } from "@/components/providers/notifications-provider";
import { useTranslation, type TranslationKey } from "@/i18n/use-translation";
import { useUserProfile } from "@/features/profile/use-user-profile";
import { ProfileEditForm } from "@/features/profile/profile-edit-form";
import { ChangeEmailDialog } from "@/features/profile/change-email-dialog";
import { ChangePasswordDialog } from "@/features/profile/change-password-dialog";
import { useEmergencyContacts } from "@/features/emergency/use-emergency-contacts";
import { updateAccountName, updateAccountEmail } from "@/lib/accounts-store";
import type { SanadProfile } from "@/types/profile";

const NEED_LABEL_KEYS: Record<string, TranslationKey> = {
  hearing: "onboarding.needs.hearing.title",
  vision: "onboarding.needs.vision.title",
  speech: "onboarding.needs.speech.title",
};

const LANGUAGE_NAME: Record<string, string> = { en: "English", ar: "العربية" };
const THEME_LABEL_KEY: Record<string, TranslationKey> = {
  light: "settings.appearance.light",
  calm: "settings.appearance.calm",
  dark: "settings.appearance.dark",
};
const FONT_SIZE_LABEL_KEY: Record<string, TranslationKey> = {
  default: "settings.fontSize.default",
  large: "settings.fontSize.large",
  "extra-large": "settings.fontSize.extraLarge",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function ProfilePage() {
  const router = useRouter();
  const { session, updateUser, signOut } = useSession();
  const { preferences } = usePreferences();
  const { profile, isLoaded: profileLoaded, updateProfile } = useUserProfile();
  const { addNotification } = useNotifications();
  const { contacts, isLoaded: contactsLoaded } = useEmergencyContacts();
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [changeEmailOpen, setChangeEmailOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const user = session?.user;

  useEffect(() => () => {
    if (savedTimer.current) clearTimeout(savedTimer.current);
  }, []);

  async function handleSave(name: string, email: string, patch: SanadProfile) {
    if (user && !user.isDemo && name !== user.name) {
      await updateAccountName(user.email, name);
    }
    if (name !== user?.name) {
      updateUser({ name });
    }
    if (user && !user.isDemo && email && email.toLowerCase() !== user.email.toLowerCase()) {
      const updated = await updateAccountEmail(user.email, email);
      updateUser({ email: updated.email });
    }
    updateProfile(patch);
    setEditing(false);
    addNotification("profileUpdated");
    setJustSaved(true);
    if (savedTimer.current) clearTimeout(savedTimer.current);
    savedTimer.current = setTimeout(() => setJustSaved(false), 3000);
  }

  function handleSignOut() {
    signOut();
    router.replace("/welcome");
  }

  const personalRows: { key: TranslationKey; value: string; dir?: "ltr" | "auto" }[] = [
    { key: "profile.fields.phone", value: profile.phone, dir: "ltr" },
    { key: "profile.fields.dateOfBirth", value: profile.dateOfBirth, dir: "ltr" },
    { key: "profile.fields.height", value: profile.heightCm ? `${profile.heightCm} cm` : "", dir: "ltr" },
  ];

  const medicalRows: { key: TranslationKey; value: string }[] = [
    { key: "profile.fields.bloodType", value: profile.bloodType },
    { key: "profile.fields.allergies", value: profile.allergies },
    { key: "profile.fields.emergencyNote", value: profile.emergencyNote },
  ];

  const selectedNeeds = preferences.accessibilityNeeds;
  const contactWord = t(contacts.length === 1 ? "emergency.contactSingular" : "emergency.contactPlural");

  return (
    <div className="space-y-6 pb-4 pt-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">{t("profile.title")}</h1>
        {!editing && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="flex min-h-11 items-center gap-1.5 rounded-xl px-3 text-sm font-medium text-brand-700 hover:bg-surface-soft"
          >
            <Pencil aria-hidden="true" className="size-4" />
            {t("profile.edit")}
          </button>
        )}
      </div>

      {editing && user ? (
        <ProfileEditForm
          name={user.name}
          email={user.email}
          isDemo={user.isDemo}
          profile={profile}
          onSave={handleSave}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <>
          {justSaved && (
            <p role="status" className="text-center text-sm font-medium text-success">
              {t("profile.saveSuccess")}
            </p>
          )}

          {/* 1. Profile header */}
          <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface px-4 py-5">
            <Avatar className="size-14 ring-2 ring-surface-soft">
              {profile.avatarDataUrl && <AvatarImage src={profile.avatarDataUrl} alt="" />}
              <AvatarFallback className="bg-brand-800 text-base font-semibold text-text-inverse">
                {user ? initials(user.name) : "?"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-semibold text-text-primary" dir="auto">
                {user?.name}
              </p>
              <p className="truncate text-sm text-text-secondary">
                <bdi dir="ltr">{user?.email}</bdi>
              </p>
              {user?.isDemo && (
                <span className="mt-1 inline-block rounded-full bg-gold-soft px-2 py-0.5 text-[0.7rem] font-medium text-brand-800">
                  {t("profile.demoAccount")}
                </span>
              )}
            </div>
          </div>

          {/* 2. Personal information */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-text-primary">{t("profile.personalInfoTitle")}</h2>
            <div className="divide-y divide-border rounded-2xl border border-border bg-surface">
              {profileLoaded ? (
                personalRows.map(({ key, value, dir }) => (
                  <div key={key} className="flex items-center justify-between gap-3 px-4 py-3">
                    <span className="text-sm text-text-secondary">{t(key)}</span>
                    <span className="truncate text-sm font-medium text-text-primary" dir={dir ?? "auto"}>
                      {value || t("profile.fields.notSet")}
                    </span>
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-text-muted">{t("common.loadingSanad")}</div>
              )}
            </div>
          </section>

          {/* 3. Accessibility needs */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-text-primary">{t("profile.accessibilityNeedsTitle")}</h2>
            <div className="rounded-2xl border border-border bg-surface px-4 py-3.5">
              {selectedNeeds.length > 0 ? (
                <ul className="flex flex-wrap gap-1.5">
                  {selectedNeeds.map((need) => (
                    <li
                      key={need}
                      className="rounded-full bg-surface-soft px-2.5 py-1 text-xs text-text-secondary"
                    >
                      {t(NEED_LABEL_KEYS[need])}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-text-muted">{t("profile.noAccessibilityNeeds")}</p>
              )}
            </div>
          </section>

          {/* 4. Medical & safety information */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-text-primary">{t("profile.medicalInfoTitle")}</h2>
            <div className="divide-y divide-border rounded-2xl border border-border bg-surface">
              {profileLoaded ? (
                medicalRows.map(({ key, value }) => (
                  <div key={key} className="flex items-center justify-between gap-3 px-4 py-3">
                    <span className="text-sm text-text-secondary">{t(key)}</span>
                    <span className="truncate text-sm font-medium text-text-primary" dir="auto">
                      {value || t("profile.fields.notSet")}
                    </span>
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-text-muted">{t("common.loadingSanad")}</div>
              )}
            </div>
          </section>

          {/* 5. Account information */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-text-primary">{t("profile.account.title")}</h2>
            <div className="divide-y divide-border rounded-2xl border border-border bg-surface">
              <div className="flex items-center gap-3 px-4 py-3">
                <Mail aria-hidden="true" className="size-4.5 shrink-0 text-brand-700" />
                <span className="min-w-0 flex-1 truncate text-sm text-text-primary">
                  <bdi dir="ltr">{user?.email}</bdi>
                </span>
                {!user?.isDemo && (
                  <button
                    type="button"
                    onClick={() => setChangeEmailOpen(true)}
                    className="shrink-0 text-sm font-medium text-brand-700 hover:underline"
                  >
                    {t("profile.account.changeEmail")}
                  </button>
                )}
              </div>
              {!user?.isDemo && (
                <button
                  type="button"
                  onClick={() => setChangePasswordOpen(true)}
                  className="flex min-h-14 w-full items-center gap-3 px-4 py-3 text-start transition-colors hover:bg-surface-soft"
                >
                  <KeyRound aria-hidden="true" className="size-4.5 shrink-0 text-brand-700" />
                  <span className="flex-1 text-sm font-medium text-text-primary">
                    {t("profile.account.changePassword")}
                  </span>
                  <ChevronRight aria-hidden="true" className="size-4 text-text-muted" />
                </button>
              )}
            </div>
          </section>

          {/* 6. Emergency contacts */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-text-primary">{t("profile.emergencySection.title")}</h2>
            <Link
              href="/app/emergency"
              className="flex min-h-14 items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3.5 transition-colors hover:bg-surface-soft"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-text-primary">
                  {contactsLoaded && contacts.length > 0
                    ? `${contacts.length} ${contactWord}`
                    : t("profile.emergencySection.empty")}
                </p>
                <p className="text-xs text-text-secondary">{t("profile.emergencySection.manage")}</p>
              </div>
              <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-text-muted" />
            </Link>
          </section>

          {/* 7. Preferences / useful shortcuts */}
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-text-primary">{t("profile.preferencesSection.title")}</h2>
            <div className="divide-y divide-border rounded-2xl border border-border bg-surface">
              <Link
                href="/app/settings"
                className="flex min-h-14 items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-soft"
              >
                <Languages aria-hidden="true" className="size-4.5 shrink-0 text-brand-700" />
                <span className="flex-1 text-sm font-medium text-text-primary">
                  {t("onboarding.personalize.languageLabel")}
                </span>
                <span className="text-sm text-text-secondary">{LANGUAGE_NAME[preferences.language]}</span>
                <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-text-muted" />
              </Link>
              <Link
                href="/app/settings"
                className="flex min-h-14 items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-soft"
              >
                <Palette aria-hidden="true" className="size-4.5 shrink-0 text-brand-700" />
                <span className="flex-1 text-sm font-medium text-text-primary">{t("settings.appearance.title")}</span>
                <span className="text-sm text-text-secondary">{t(THEME_LABEL_KEY[preferences.themeMode])}</span>
                <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-text-muted" />
              </Link>
              <Link
                href="/app/settings"
                className="flex min-h-14 items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-soft"
              >
                <CaseSensitive aria-hidden="true" className="size-4.5 shrink-0 text-brand-700" />
                <span className="flex-1 text-sm font-medium text-text-primary">{t("settings.fontSize.title")}</span>
                <span className="text-sm text-text-secondary">{t(FONT_SIZE_LABEL_KEY[preferences.fontSize])}</span>
                <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-text-muted" />
              </Link>
              <Link
                href="/app/glasses"
                className="flex min-h-14 items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-soft"
              >
                <Glasses aria-hidden="true" className="size-4.5 shrink-0 text-brand-700" />
                <span className="flex-1 text-sm font-medium text-text-primary">{t("home.glasses.title")}</span>
                <span className="text-sm text-text-secondary">{t("common.notConnected")}</span>
                <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-text-muted" />
              </Link>
            </div>
          </section>

          <div className="rounded-2xl border border-dashed border-border bg-surface px-4 py-5 text-sm text-text-secondary">
            <p>{t("profile.privacyNotice")}</p>
          </div>

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
        </>
      )}

      <ChangeEmailDialog open={changeEmailOpen} onOpenChange={setChangeEmailOpen} />
      <ChangePasswordDialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen} />
    </div>
  );
}
