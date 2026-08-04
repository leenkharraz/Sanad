import Link from "next/link";
import { TriangleAlert, ChevronRight } from "lucide-react";

export function EmergencySection() {
  return (
    <Link
      href="/app/emergency"
      className="flex items-center gap-3.5 rounded-2xl border border-danger/30 bg-danger-soft px-4 py-4 text-danger transition-colors hover:border-danger/50"
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-danger text-white">
        <TriangleAlert aria-hidden="true" className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold">Emergency SOS</p>
        <p className="text-xs text-danger/80">Trusted contacts, live location, one-tap alert</p>
      </div>
      <ChevronRight aria-hidden="true" className="size-5 shrink-0" />
    </Link>
  );
}
