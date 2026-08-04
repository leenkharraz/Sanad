"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Ear, Eye, MessageCircle } from "lucide-react";
import { AppLogo } from "@/components/design-system/app-logo";
import { Button } from "@/components/ui/button";
import { useSession } from "@/components/providers/session-provider";
import { DEMO_USER } from "@/lib/mock-auth";

export default function WelcomePage() {
  const router = useRouter();
  const { signIn } = useSession();

  function handleContinueAsDemo() {
    signIn(DEMO_USER);
    router.push("/onboarding/accessibility");
  }

  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-background">
      <div className="safe-top flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
        <AppLogo className="size-16" />
        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-text-primary">
          SANAD
        </h1>
        <p className="mt-2 max-w-xs text-balance text-base text-text-secondary">
          Smart glasses and a connected app, working together to support how you
          hear, see, and speak.
        </p>

        <ul className="mt-8 flex w-full max-w-xs flex-col gap-2.5 text-left">
          <li className="flex items-center gap-3 rounded-xl bg-surface-soft px-3.5 py-2.5">
            <Ear aria-hidden="true" className="size-5 shrink-0 text-brand-700" />
            <span className="text-sm text-text-secondary">
              Live captions and sound alerts
            </span>
          </li>
          <li className="flex items-center gap-3 rounded-xl bg-surface-soft px-3.5 py-2.5">
            <Eye aria-hidden="true" className="size-5 shrink-0 text-brand-700" />
            <span className="text-sm text-text-secondary">
              Object and obstacle awareness
            </span>
          </li>
          <li className="flex items-center gap-3 rounded-xl bg-surface-soft px-3.5 py-2.5">
            <MessageCircle aria-hidden="true" className="size-5 shrink-0 text-brand-700" />
            <span className="text-sm text-text-secondary">
              Text-to-speech and quick phrases
            </span>
          </li>
        </ul>
      </div>

      <div className="safe-bottom safe-x mx-auto flex w-full max-w-sm flex-col gap-3 px-6 pb-8">
        <Button asChild size="touch" className="w-full">
          <Link href="/auth/sign-in">Sign in</Link>
        </Button>
        <Button asChild variant="outline" size="touch" className="w-full">
          <Link href="/auth/sign-up">Create account</Link>
        </Button>
        <button
          type="button"
          onClick={handleContinueAsDemo}
          className="min-h-11 text-sm font-medium text-text-secondary underline-offset-4 hover:text-text-primary hover:underline"
        >
          Continue as demo user
        </button>
      </div>
    </div>
  );
}
