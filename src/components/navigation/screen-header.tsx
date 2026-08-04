"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export function ScreenHeader({ title, backHref }: { title: string; backHref?: string }) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-1 pt-4">
      <button
        type="button"
        onClick={() => (backHref ? router.push(backHref) : router.back())}
        aria-label="Go back"
        className="flex size-11 shrink-0 items-center justify-center rounded-full text-text-secondary hover:bg-surface-soft hover:text-text-primary"
      >
        <ChevronLeft aria-hidden="true" className="size-5" />
      </button>
      <h1 className="text-xl font-semibold tracking-tight text-text-primary">{title}</h1>
    </div>
  );
}
