"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateAccountEmail, accountExists } from "@/lib/accounts-store";
import { useSession } from "@/components/providers/session-provider";
import { useTranslation } from "@/i18n/use-translation";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ChangeEmailDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { session, updateUser } = useSession();
  const { t } = useTranslation();
  const [newEmail, setNewEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  function reset() {
    setNewEmail("");
    setError(null);
    setSuccess(false);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!session) return;
    const trimmed = newEmail.trim();
    if (!trimmed) {
      setError(t("auth.validation.emailRequired"));
      return;
    }
    if (!EMAIL_REGEX.test(trimmed)) {
      setError(t("auth.validation.emailInvalid"));
      return;
    }
    const normalized = trimmed.toLowerCase();
    if (normalized !== session.user.email && accountExists(normalized)) {
      setError(t("auth.validation.duplicateAccount"));
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const updated = await updateAccountEmail(session.user.email, trimmed);
      updateUser({ email: updated.email });
      setSuccess(true);
    } catch {
      setError(t("auth.validation.genericError"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("profile.account.changeEmailDialogTitle")}</DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="space-y-4">
            <p className="text-sm text-success">{t("profile.account.emailChanged")}</p>
            <DialogFooter>
              <Button type="button" onClick={() => onOpenChange(false)}>
                {t("common.done")}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="new-email">{t("profile.account.newEmail")}</Label>
              <Input
                id="new-email"
                type="email"
                autoComplete="email"
                dir="ltr"
                className="h-11 text-start"
                value={newEmail}
                onChange={(event) => setNewEmail(event.target.value)}
                aria-invalid={!!error}
              />
              {error && (
                <p role="alert" className="text-xs text-danger">
                  {error}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
                {t("profile.saveChanges")}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
