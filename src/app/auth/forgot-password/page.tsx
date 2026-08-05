"use client";

import { AuthScreenLayout } from "@/features/auth/auth-screen-layout";
import { ForgotPasswordForm } from "@/features/auth/forgot-password-form";
import { useTranslation } from "@/i18n/use-translation";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  return (
    <AuthScreenLayout
      title={t("auth.forgotPassword.title")}
      subtitle={t("auth.forgotPassword.subtitle")}
      backHref="/auth/sign-in"
    >
      <ForgotPasswordForm />
    </AuthScreenLayout>
  );
}
