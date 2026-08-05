"use client";

import { AuthScreenLayout } from "@/features/auth/auth-screen-layout";
import { SignUpForm } from "@/features/auth/sign-up-form";
import { useTranslation } from "@/i18n/use-translation";

export default function SignUpPage() {
  const { t } = useTranslation();
  return (
    <AuthScreenLayout
      title={t("auth.signUp.title")}
      subtitle={t("auth.signUp.subtitle")}
      backHref="/welcome"
    >
      <SignUpForm />
    </AuthScreenLayout>
  );
}
