import { z } from "zod";
import type { TranslationKey } from "@/i18n/use-translation";

type Translate = (key: TranslationKey) => string;

export function createSignInSchema(t: Translate) {
  return z.object({
    email: z.string().min(1, t("auth.validation.emailRequired")).email(t("auth.validation.emailInvalid")),
    password: z.string().min(1, t("auth.validation.passwordRequired")),
    rememberMe: z.boolean(),
  });
}

export type SignInValues = z.infer<ReturnType<typeof createSignInSchema>>;

export function createSignUpSchema(t: Translate) {
  return z
    .object({
      name: z.string().min(2, t("auth.validation.nameRequired")),
      email: z.string().min(1, t("auth.validation.emailRequired")).email(t("auth.validation.emailInvalid")),
      password: z
        .string()
        .min(8, t("auth.validation.passwordMinLength"))
        .regex(/[0-9]/, t("auth.validation.passwordNeedsNumber")),
      confirmPassword: z.string().min(1, t("auth.validation.confirmPasswordRequired")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("auth.validation.passwordsDoNotMatch"),
      path: ["confirmPassword"],
    });
}

export type SignUpValues = z.infer<ReturnType<typeof createSignUpSchema>>;

export function createForgotPasswordSchema(t: Translate) {
  return z.object({
    email: z.string().min(1, t("auth.validation.emailRequired")).email(t("auth.validation.emailInvalid")),
  });
}

export type ForgotPasswordValues = z.infer<ReturnType<typeof createForgotPasswordSchema>>;
