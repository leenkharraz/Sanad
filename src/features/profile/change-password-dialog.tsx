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
import { updateAccountPassword } from "@/lib/accounts-store";
import { useSession } from "@/components/providers/session-provider";
import { useTranslation } from "@/i18n/use-translation";

export function ChangePasswordDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { session } = useSession();
  const { t } = useTranslation();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  function reset() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
    setSuccess(false);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!session) return;
    if (!currentPassword) {
      setError(t("auth.validation.passwordRequired"));
      return;
    }
    if (newPassword.length < 8) {
      setError(t("auth.validation.passwordMinLength"));
      return;
    }
    if (!/[0-9]/.test(newPassword)) {
      setError(t("auth.validation.passwordNeedsNumber"));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(t("auth.validation.passwordsDoNotMatch"));
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await updateAccountPassword(session.user.email, currentPassword, newPassword);
      setSuccess(true);
    } catch (err) {
      if (err instanceof Error && err.message === "INCORRECT_PASSWORD") {
        setError(t("profile.account.incorrectCurrentPassword"));
      } else {
        setError(t("auth.validation.genericError"));
      }
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
          <DialogTitle>{t("profile.account.changePasswordDialogTitle")}</DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="space-y-4">
            <p className="text-sm text-success">{t("profile.account.passwordChanged")}</p>
            <DialogFooter>
              <Button type="button" onClick={() => onOpenChange(false)}>
                {t("common.done")}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="current-password">{t("profile.account.currentPassword")}</Label>
              <Input
                id="current-password"
                type="password"
                autoComplete="current-password"
                className="h-11"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-password">{t("profile.account.newPassword")}</Label>
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                className="h-11"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm-new-password">{t("profile.account.confirmNewPassword")}</Label>
              <Input
                id="confirm-new-password"
                type="password"
                autoComplete="new-password"
                className="h-11"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
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
