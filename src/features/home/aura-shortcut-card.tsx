import Link from "next/link";
import { Sparkles, ChevronRight } from "lucide-react";

export function AuraShortcutCard() {
  return (
    <Link
      href="/app/aura"
      className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3.5 transition-colors hover:bg-surface-soft"
    >
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gold-soft text-brand-800">
        <Sparkles aria-hidden="true" className="size-6" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-text-primary">Ask Aura</p>
        <p className="text-xs text-text-muted">Your assistant for quick help</p>
      </div>
      <ChevronRight aria-hidden="true" className="size-5 shrink-0 text-text-muted" />
    </Link>
  );
}
