import type { Metadata } from "next";
import { AuthScreenLayout } from "@/features/auth/auth-screen-layout";
import { SignUpForm } from "@/features/auth/sign-up-form";

export const metadata: Metadata = { title: "Create account — SANAD" };

export default function SignUpPage() {
  return (
    <AuthScreenLayout
      title="Create your account"
      subtitle="Set up SANAD to match how you hear, see, and speak."
      backHref="/welcome"
    >
      <SignUpForm />
    </AuthScreenLayout>
  );
}
