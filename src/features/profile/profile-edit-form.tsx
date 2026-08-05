"use client";

import { useRef, useState } from "react";
import { Camera, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AccessibilityNeedsEditor } from "@/features/settings/accessibility-needs-editor";
import { useTranslation, type TranslationKey } from "@/i18n/use-translation";
import { isValidPhone } from "@/lib/phone";
import { accountExists } from "@/lib/accounts-store";
import { BLOOD_TYPES, type SanadProfile } from "@/types/profile";

const MAX_AVATAR_BYTES = 1_000_000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface FormErrors {
  name?: TranslationKey;
  email?: TranslationKey;
  phone?: TranslationKey;
  dateOfBirth?: TranslationKey;
  heightCm?: TranslationKey;
}

export function ProfileEditForm({
  name,
  email,
  isDemo,
  profile,
  onSave,
  onCancel,
}: {
  name: string;
  email: string;
  isDemo?: boolean;
  profile: SanadProfile;
  onSave: (name: string, email: string, patch: SanadProfile) => void;
  onCancel: () => void;
}) {
  const { t } = useTranslation();
  const [draftName, setDraftName] = useState(name);
  const [draftEmail, setDraftEmail] = useState(email);
  const [draft, setDraft] = useState<SanadProfile>(profile);
  const [errors, setErrors] = useState<FormErrors>({});
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleAvatarPick(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.size > MAX_AVATAR_BYTES) {
      setAvatarError(t("profile.avatarTooLarge"));
      return;
    }
    setAvatarError(null);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setDraft((prev) => ({ ...prev, avatarDataUrl: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  }

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (!draftName.trim()) next.name = "auth.validation.nameRequired";
    if (!isDemo) {
      const trimmedEmail = draftEmail.trim();
      if (!trimmedEmail) {
        next.email = "auth.validation.emailRequired";
      } else if (!EMAIL_REGEX.test(trimmedEmail)) {
        next.email = "auth.validation.emailInvalid";
      } else if (
        trimmedEmail.toLowerCase() !== email.toLowerCase() &&
        accountExists(trimmedEmail)
      ) {
        next.email = "auth.validation.duplicateAccount";
      }
    }
    if (!isValidPhone(draft.phone)) next.phone = "profile.validation.phoneInvalid";
    if (draft.dateOfBirth) {
      const parsed = new Date(draft.dateOfBirth);
      if (Number.isNaN(parsed.getTime()) || parsed > new Date()) {
        next.dateOfBirth = "profile.validation.dobInvalid";
      }
    }
    if (draft.heightCm) {
      const heightNum = Number(draft.heightCm);
      if (!Number.isFinite(heightNum) || heightNum < 30 || heightNum > 300) {
        next.heightCm = "profile.validation.heightInvalid";
      }
    }
    return next;
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    onSave(draftName.trim(), draftEmail.trim(), draft);
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface p-4">
        <div className="relative">
          <Avatar size="lg" className="size-20">
            {draft.avatarDataUrl && <AvatarImage src={draft.avatarDataUrl} alt="" />}
            <AvatarFallback className="bg-brand-800 text-lg font-semibold text-text-inverse">
              {draftName ? initials(draftName) : "?"}
            </AvatarFallback>
          </Avatar>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            aria-label={t("profile.avatarUploadHint")}
            className="absolute -end-1 -bottom-1 flex size-8 items-center justify-center rounded-full border-2 border-surface bg-brand-700 text-text-inverse hover:bg-brand-800"
          >
            <Camera aria-hidden="true" className="size-3.5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarPick}
            className="sr-only"
          />
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-xs font-medium text-brand-700 hover:underline"
        >
          {t("profile.avatarUploadHint")}
        </button>
        {draft.avatarDataUrl && (
          <button
            type="button"
            onClick={() => setDraft((prev) => ({ ...prev, avatarDataUrl: "" }))}
            className="flex items-center gap-1 text-xs font-medium text-text-muted hover:text-danger"
          >
            <X aria-hidden="true" className="size-3.5" />
            {t("profile.avatarRemove")}
          </button>
        )}
        {avatarError && (
          <p role="alert" className="text-xs text-danger">
            {avatarError}
          </p>
        )}
      </div>

      <section className="space-y-4 rounded-2xl border border-border bg-surface p-4">
        <h2 className="text-sm font-semibold text-text-primary">{t("profile.personalInfoTitle")}</h2>

        <div className="space-y-1.5">
          <Label htmlFor="profile-name">{t("auth.signUp.fullName")}</Label>
          <input
            id="profile-name"
            value={draftName}
            onChange={(event) => setDraftName(event.target.value)}
            dir="auto"
            aria-invalid={!!errors.name}
            className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-text-primary"
          />
          {errors.name && (
            <p role="alert" className="text-xs text-danger">
              {t(errors.name)}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="profile-phone">{t("profile.fields.phone")}</Label>
          <input
            id="profile-phone"
            type="tel"
            inputMode="tel"
            value={draft.phone}
            onChange={(event) => setDraft((prev) => ({ ...prev, phone: event.target.value }))}
            dir="ltr"
            placeholder="05XXXXXXXX"
            aria-invalid={!!errors.phone}
            className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-start text-sm text-text-primary"
          />
          {errors.phone && (
            <p role="alert" className="text-xs text-danger">
              {t(errors.phone)}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="profile-email">{t("profile.fields.email")}</Label>
          <input
            id="profile-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={draftEmail}
            onChange={(event) => setDraftEmail(event.target.value)}
            dir="ltr"
            disabled={isDemo}
            aria-invalid={!!errors.email}
            className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-start text-sm text-text-primary disabled:opacity-60"
          />
          {errors.email && (
            <p role="alert" className="text-xs text-danger">
              {t(errors.email)}
            </p>
          )}
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
            aria-invalid={!!errors.dateOfBirth}
            className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-start text-sm text-text-primary"
          />
          {errors.dateOfBirth && (
            <p role="alert" className="text-xs text-danger">
              {t(errors.dateOfBirth)}
            </p>
          )}
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
            aria-invalid={!!errors.heightCm}
            className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-start text-sm text-text-primary"
          />
          {errors.heightCm && (
            <p role="alert" className="text-xs text-danger">
              {t(errors.heightCm)}
            </p>
          )}
        </div>
      </section>

      <section className="space-y-2 rounded-2xl border border-border bg-surface p-4">
        <h2 className="text-sm font-semibold text-text-primary">{t("profile.accessibilityNeedsTitle")}</h2>
        <AccessibilityNeedsEditor />
      </section>

      <section className="space-y-4 rounded-2xl border border-border bg-surface p-4">
        <h2 className="text-sm font-semibold text-text-primary">{t("profile.medicalInfoTitle")}</h2>

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
      </section>

      <div className="flex gap-2 pt-1">
        <Button type="submit" size="touch" className="flex-1">
          {t("profile.saveChanges")}
        </Button>
        <Button type="button" variant="outline" size="touch" className="flex-1" onClick={onCancel}>
          {t("common.cancel")}
        </Button>
      </div>
    </form>
  );
}
