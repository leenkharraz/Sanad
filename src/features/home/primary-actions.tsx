import Link from "next/link";
import { Captions, Volume2 } from "lucide-react";

export function PrimaryActions() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Link
        href="/app/hearing"
        className="flex flex-col items-start gap-3 rounded-2xl bg-primary px-4 py-4 text-primary-foreground transition-opacity hover:opacity-90"
      >
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary-foreground/15">
          <Captions aria-hidden="true" className="size-5" />
        </span>
        <span className="text-sm font-semibold">Start Captioning</span>
      </Link>
      <Link
        href="/app/speech"
        className="flex flex-col items-start gap-3 rounded-2xl border border-border bg-surface px-4 py-4 text-text-primary transition-colors hover:bg-surface-soft"
      >
        <span className="flex size-10 items-center justify-center rounded-xl bg-surface-soft text-brand-700">
          <Volume2 aria-hidden="true" className="size-5" />
        </span>
        <span className="text-sm font-semibold">Text To Speech</span>
      </Link>
    </div>
  );
}
