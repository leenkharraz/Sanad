"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/feedback/form-error";
import { ProviderButtons } from "@/features/auth/provider-buttons";
import { signUpSchema, type SignUpValues } from "@/features/auth/schemas";
import { mockSignUp } from "@/lib/mock-auth";
import { useSession } from "@/components/providers/session-provider";

export function SignUpForm() {
  const router = useRouter();
  const { signIn } = useSession();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: SignUpValues) => {
    setFormError(null);
    try {
      const user = await mockSignUp(values.name, values.email, values.password);
      signIn(user);
      router.push("/onboarding/accessibility");
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {formError && <FormError message={formError} />}

      <div className="space-y-1.5">
        <Label htmlFor="name">Full name</Label>
        <Input
          id="name"
          autoComplete="name"
          placeholder="Your name"
          className="h-11"
          aria-invalid={!!errors.name}
          {...register("name")}
        />
        {errors.name && (
          <p role="alert" className="text-xs text-danger">
            {errors.name.message}
          </p>
        )}
      </div>

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

      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters, one number"
          className="h-11"
          aria-invalid={!!errors.password}
          {...register("password")}
        />
        {errors.password && (
          <p role="alert" className="text-xs text-danger">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          className="h-11"
          aria-invalid={!!errors.confirmPassword}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p role="alert" className="text-xs text-danger">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button type="submit" size="touch" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
        Create account
      </Button>

      <div className="flex items-center gap-3 py-1 text-xs text-text-muted">
        <span className="h-px flex-1 bg-border" />
        or continue with
        <span className="h-px flex-1 bg-border" />
      </div>

      <ProviderButtons />
    </form>
  );
}
