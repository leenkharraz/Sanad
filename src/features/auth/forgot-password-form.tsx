"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/feedback/form-error";
import {
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from "@/features/auth/schemas";
import { mockRequestPasswordReset } from "@/lib/mock-auth";

export function ForgotPasswordForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    setFormError(null);
    try {
      await mockRequestPasswordReset(values.email);
      setSubmittedEmail(values.email);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Something went wrong.");
    }
  };

  if (submittedEmail) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-success-soft px-5 py-8 text-center">
        <CheckCircle2 aria-hidden="true" className="size-8 text-success" />
        <p className="text-sm text-text-primary">
          If an account exists for <strong>{submittedEmail}</strong>, a reset link has
          been sent. This is a prototype — no real email is sent.
        </p>
        <Link
          href="/auth/sign-in"
          className="text-sm font-medium text-brand-700 hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {formError && <FormError message={formError} />}

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="h-11"
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
        Send reset link
      </Button>

      <Link
        href="/auth/sign-in"
        className="block text-center text-sm font-medium text-text-secondary hover:text-text-primary"
      >
        Back to sign in
      </Link>
    </form>
  );
}
