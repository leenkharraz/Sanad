"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createForgotPasswordSchema,
  type ForgotPasswordValues,
} from "@/features/auth/schemas";
import { useTranslation } from "@/i18n/use-translation";

/**
 * There is no email/password-reset backend in this prototype. The email
 * field is still validated for real (a genuine, useful check), but
 * submitting it never pretends a reset email was sent — it honestly tells
 * the user recovery isn't available yet, rather than faking success.
 */
export function ForgotPasswordForm() {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);

  const schema = useMemo(() => createForgotPasswordSchema(t), [t]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-warning-soft px-5 py-8 text-center">
        <Info aria-hidden="true" className="size-8 text-warning" />
        <p className="text-sm text-text-primary">{t("auth.forgotPassword.unavailableNotice")}</p>
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

      <Button type="submit" size="touch" className="w-full">
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
