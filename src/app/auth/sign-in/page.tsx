"use client";

import { AuthScreenLayout } from "@/features/auth/auth-screen-layout";
import { SignInForm } from "@/features/auth/sign-in-form";
import { useTranslation } from "@/i18n/use-translation";

export default function SignInPage() {
  const { t } = useTranslation();
  return (
    <AuthScreenLayout title={t("auth.signIn.title")} subtitle={t("auth.signIn.subtitle")}>
      <SignInForm />
    </AuthScreenLayout>
  );
}
