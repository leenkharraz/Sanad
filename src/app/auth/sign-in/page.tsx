import type { Metadata } from "next";
import { AuthScreenLayout } from "@/features/auth/auth-screen-layout";
import { SignInForm } from "@/features/auth/sign-in-form";

export const metadata: Metadata = { title: "Sign in — SANAD" };

export default function SignInPage() {
  return (
    <AuthScreenLayout title="Welcome back" subtitle="Sign in to continue to SANAD.">
      <SignInForm />
    </AuthScreenLayout>
  );
}
