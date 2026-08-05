"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ScanFace } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FormError } from "@/components/feedback/form-error";
import { ProviderButtons } from "@/features/auth/provider-buttons";
import { createSignInSchema, type SignInValues } from "@/features/auth/schemas";
import { authErrorKey } from "@/features/auth/auth-error";
import { mockSignIn } from "@/lib/mock-auth";
import { useSession } from "@/components/providers/session-provider";
import { usePreferences } from "@/components/providers/preferences-provider";
import { useTranslation } from "@/i18n/use-translation";

export function SignInForm() {
  const router = useRouter();
  const { signIn } = useSession();
  const { preferences } = usePreferences();
  const { t } = useTranslation();
  const [formError, setFormError] = useState<string | null>(null);

  const schema = useMemo(() => createSignInSchema(t), [t]);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", rememberMe: true },
  });
  const rememberMe = useWatch({ control, name: "rememberMe" });

  const onSubmit = async (values: SignInValues) => {
    setFormError(null);
    try {
      const user = await mockSignIn(values.email, values.password);
      signIn(user);
      if (!preferences.onboardingComplete) {
        router.push("/onboarding/accessibility");
      } else if (!preferences.personalizationComplete) {
        router.push("/onboarding/personalize");
      } else {
        router.push("/app/home");
      }
    } catch (error) {
      setFormError(t(authErrorKey(error)));
    }
  };

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

      <div className="space-y-1.5">
        <Label htmlFor="password">{t("auth.password")}</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder={t("auth.passwordPlaceholder")}
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

      <div className="flex items-center justify-between">
        <label className="flex min-h-11 items-center gap-2 text-sm text-text-secondary">
          <Checkbox
            checked={rememberMe}
            onCheckedChange={(checked) => setValue("rememberMe", checked === true)}
          />
          {t("auth.rememberMe")}
        </label>
        <Link
          href="/auth/forgot-password"
          className="text-sm font-medium text-brand-700 hover:underline"
        >
          {t("auth.forgotPasswordLink")}
        </Link>
      </div>

      <Button type="submit" size="touch" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
        {t("auth.signIn.submit")}
      </Button>

      <button
        type="button"
        disabled
        aria-disabled="true"
        title={t("auth.faceIdNotice")}
        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-border text-sm font-medium text-text-secondary opacity-60"
      >
        <ScanFace aria-hidden="true" className="size-4.5" />
        {t("auth.faceId")}
      </button>

      <div className="flex items-center gap-3 py-1 text-xs text-text-muted">
        <span className="h-px flex-1 bg-border" />
        {t("auth.orContinueWith")}
        <span className="h-px flex-1 bg-border" />
      </div>

      <ProviderButtons />
    </form>
  );
}
