import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { HomeMode } from "@/data/home-modes";

export function ModeCard({ mode, selected }: { mode: HomeMode; selected: boolean }) {
  const Icon = mode.icon;

  return (
    <Link
      href={mode.href}
      className="flex items-start gap-3.5 rounded-2xl border border-border bg-surface px-4 py-4 transition-colors hover:bg-surface-soft"
    >
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-800 text-text-inverse">
        <Icon aria-hidden="true" className="size-6" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-text-primary">{mode.title}</h3>
          {selected && (
            <span className="rounded-full bg-success-soft px-2 py-0.5 text-[0.7rem] font-medium text-success">
              For you
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-text-secondary">{mode.features.slice(0, 3).join(" · ")}</p>
      </div>
      <ChevronRight aria-hidden="true" className="mt-2.5 size-5 shrink-0 text-text-muted" />
    </Link>
  );
}
