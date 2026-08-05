"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/feedback/form-error";
import {
  createForgotPasswordSchema,
  type ForgotPasswordValues,
} from "@/features/auth/schemas";
import { authErrorKey } from "@/features/auth/auth-error";
import { mockRequestPasswordReset } from "@/lib/mock-auth";
import { useTranslation } from "@/i18n/use-translation";

export function ForgotPasswordForm() {
  const { t } = useTranslation();
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const schema = useMemo(() => createForgotPasswordSchema(t), [t]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    setFormError(null);
    try {
      await mockRequestPasswordReset(values.email);
      setSubmittedEmail(values.email);
    } catch (error) {
      setFormError(t(authErrorKey(error)));
    }
  };

  if (submittedEmail) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-success-soft px-5 py-8 text-center">
        <CheckCircle2 aria-hidden="true" className="size-8 text-success" />
        <p className="text-sm text-text-primary">
          {t("auth.forgotPassword.successPrefix")}{" "}
          <bdi dir="ltr" className="font-medium">
            {submittedEmail}
          </bdi>
          {t("auth.forgotPassword.successSuffix")}
        </p>
        <Link
          href="/auth/sign-in"
          className="text-sm font-medium text-brand-700 hover:underline"
        >
          {t("auth.forgotPassword.backToSignIn")}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {formError && <FormError message={formError} />}

      <div className="space-y-1.5">
        <Label htmlFor="email">{t("auth.email")}</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder={t("auth.emailPlaceholder")}
          dir="ltr"
          className="h-11 text-start"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email && (
          <p role="alert" className="text-xs text-danger">
            {errors.email.message}
          </p>
        )}
      </div>

      <Button type="submit" size="touch" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
        {t("auth.forgotPassword.submit")}
      </Button>

      <Link
        href="/auth/sign-in"
        className="block text-center text-sm font-medium text-text-secondary hover:text-text-primary"
      >
        {t("auth.forgotPassword.backToSignIn")}
      </Link>
    </form>
  );
}
