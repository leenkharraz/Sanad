"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/i18n/use-translation";
import { BLOOD_TYPES, type SanadProfile } from "@/types/profile";

function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function ProfileEditForm({
  name,
  profile,
  onSave,
  onCancel,
}: {
  name: string;
  profile: SanadProfile;
  onSave: (name: string, patch: SanadProfile) => void;
  onCancel: () => void;
}) {
  const { t } = useTranslation();
  const [draftName, setDraftName] = useState(name);
  const [draft, setDraft] = useState<SanadProfile>(profile);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!draftName.trim()) return;
    onSave(draftName.trim(), draft);
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border bg-surface p-4">
      <div className="space-y-1.5">
        <Label htmlFor="profile-name">{t("auth.signUp.fullName")}</Label>
        <input
          id="profile-name"
          value={draftName}
          onChange={(event) => setDraftName(event.target.value)}
          dir="auto"
          required
          className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-text-primary"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="profile-dob">{t("profile.fields.dateOfBirth")}</Label>
        <input
          id="profile-dob"
          type="date"
          value={draft.dateOfBirth}
          max={todayISODate()}
          onChange={(event) => setDraft((prev) => ({ ...prev, dateOfBirth: event.target.value }))}
          dir="ltr"
          className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-start text-sm text-text-primary"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="profile-height">{t("profile.fields.height")}</Label>
        <input
          id="profile-height"
          type="number"
          inputMode="numeric"
          min={0}
          max={300}
          value={draft.heightCm}
          onChange={(event) => setDraft((prev) => ({ ...prev, heightCm: event.target.value }))}
          dir="ltr"
          className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-start text-sm text-text-primary"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="profile-blood-type">{t("profile.fields.bloodType")}</Label>
        <select
          id="profile-blood-type"
          value={draft.bloodType}
          onChange={(event) => setDraft((prev) => ({ ...prev, bloodType: event.target.value }))}
          dir="ltr"
          className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-start text-sm text-text-primary"
        >
          <option value="">{t("profile.fields.bloodTypePlaceholder")}</option>
          {BLOOD_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="profile-allergies">{t("profile.fields.allergies")}</Label>
        <textarea
          id="profile-allergies"
          value={draft.allergies}
          onChange={(event) => setDraft((prev) => ({ ...prev, allergies: event.target.value }))}
          rows={2}
          dir="auto"
          className="w-full resize-none rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-text-primary"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="profile-emergency-note">{t("profile.fields.emergencyNote")}</Label>
        <textarea
          id="profile-emergency-note"
          value={draft.emergencyNote}
          onChange={(event) => setDraft((prev) => ({ ...prev, emergencyNote: event.target.value }))}
          rows={2}
          dir="auto"
          className="w-full resize-none rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-text-primary"
        />
      </div>

      <div className="flex gap-2 pt-1">
        <Button type="submit" size="touch" className="flex-1">
          {t("common.save")}
        </Button>
        <Button type="button" variant="outline" size="touch" className="flex-1" onClick={onCancel}>
          {t("common.cancel")}
        </Button>
      </div>
    </form>
  );
}
