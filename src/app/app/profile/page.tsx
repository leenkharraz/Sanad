"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSession } from "@/components/providers/session-provider";
import { usePreferences } from "@/components/providers/preferences-provider";
import { useTranslation, type TranslationKey } from "@/i18n/use-translation";
import { useUserProfile } from "@/features/profile/use-user-profile";
import { ProfileEditForm } from "@/features/profile/profile-edit-form";
import { updateAccountName } from "@/lib/accounts-store";
import type { SanadProfile } from "@/types/profile";

const NEED_LABEL_KEYS: Record<string, TranslationKey> = {
  hearing: "onboarding.needs.hearing.title",
  vision: "onboarding.needs.vision.title",
  speech: "onboarding.needs.speech.title",
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
  const { session, updateUser } = useSession();
  const { preferences } = usePreferences();
  const { profile, isLoaded: profileLoaded, updateProfile } = useUserProfile();
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const user = session?.user;

  async function handleSave(name: string, patch: SanadProfile) {
    if (user && !user.isDemo && name !== user.name) {
      await updateAccountName(user.email, name);
    }
    if (name !== user?.name) {
      updateUser({ name });
    }
    updateProfile(patch);
    setEditing(false);
  }

  const fieldRows: { key: TranslationKey; value: string }[] = [
    { key: "profile.fields.dateOfBirth", value: profile.dateOfBirth },
    { key: "profile.fields.height", value: profile.heightCm ? `${profile.heightCm} cm` : "" },
    { key: "profile.fields.bloodType", value: profile.bloodType },
    { key: "profile.fields.allergies", value: profile.allergies },
    { key: "profile.fields.emergencyNote", value: profile.emergencyNote },
  ];

  const selectedNeeds = preferences.accessibilityNeeds;

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
          profile={profile}
          onSave={handleSave}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <>
          <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface px-4 py-5">
            <Avatar className="size-14 ring-2 ring-surface-soft">
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

          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-text-primary">{t("profile.personalInfoTitle")}</h2>
            <div className="divide-y divide-border rounded-2xl border border-border bg-surface">
              {profileLoaded ? (
                fieldRows.map(({ key, value }) => (
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

          <div className="rounded-2xl border border-dashed border-border bg-surface px-4 py-5 text-sm text-text-secondary">
            <p>{t("profile.privacyNotice")}</p>
          </div>

          <Link
            href="/app/settings"
            className="block text-center text-sm font-medium text-brand-700 hover:underline"
          >
            {t("profile.managePreferences")}
          </Link>
        </>
      )}
    </div>
  );
}
