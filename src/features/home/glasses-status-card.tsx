import Link from "next/link";
import { Glasses, ChevronRight } from "lucide-react";

export function GlassesStatusCard() {
  return (
    <Link
      href="/app/glasses"
      className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3.5 transition-colors hover:bg-surface-soft"
    >
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-surface-soft text-brand-700">
        <Glasses aria-hidden="true" className="size-6" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-text-primary">SANAD Glasses</p>
        <p className="flex items-center gap-1.5 text-xs text-text-muted">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-text-muted" />
          Not connected
        </p>
      </div>
      <ChevronRight aria-hidden="true" className="size-5 shrink-0 text-text-muted" />
    </Link>
  );
}
