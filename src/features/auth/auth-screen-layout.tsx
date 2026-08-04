import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { AppLogo } from "@/components/design-system/app-logo";

interface AuthScreenLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  backHref?: string;
}

export function AuthScreenLayout({
  title,
  subtitle,
  children,
  backHref = "/welcome",
}: AuthScreenLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-background">
      <div className="safe-top flex items-center px-4 py-3">
        <Link
          href={backHref}
          aria-label="Go back"
          className="flex size-11 items-center justify-center rounded-full text-text-secondary hover:bg-surface-soft hover:text-text-primary"
        >
          <ChevronLeft aria-hidden="true" className="size-5" />
        </Link>
      </div>

      <div className="mx-auto w-full max-w-sm flex-1 px-6 pb-10 pt-2">
        <AppLogo className="size-10" />
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-text-primary">
          {title}
        </h1>
        <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>

        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
