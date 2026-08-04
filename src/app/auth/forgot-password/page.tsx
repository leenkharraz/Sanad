import type { Metadata } from "next";
import { AuthScreenLayout } from "@/features/auth/auth-screen-layout";
import { ForgotPasswordForm } from "@/features/auth/forgot-password-form";

export const metadata: Metadata = { title: "Reset password — SANAD" };

export default function ForgotPasswordPage() {
  return (
    <AuthScreenLayout
      title="Reset your password"
      subtitle="Enter your email and we'll send a reset link."
      backHref="/auth/sign-in"
    >
      <ForgotPasswordForm />
    </AuthScreenLayout>
  );
}
