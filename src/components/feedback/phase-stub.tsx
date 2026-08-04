import type { LucideIcon } from "lucide-react";
import { Construction } from "lucide-react";

interface PhaseStubProps {
  title: string;
  description: string;
  phase: string;
  icon?: LucideIcon;
}

export function PhaseStub({ title, description, phase, icon: Icon = Construction }: PhaseStubProps) {
  return (
    <div
      role="status"
      className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-surface px-6 py-14 text-center"
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-surface-soft text-brand-700">
        <Icon aria-hidden="true" className="size-7" />
      </div>
      <div className="space-y-1.5">
        <h1 className="text-lg font-semibold text-text-primary">{title}</h1>
        <p className="mx-auto max-w-sm text-sm text-text-secondary">{description}</p>
      </div>
      <span className="rounded-full bg-warning-soft px-3 py-1 text-xs font-medium text-warning">
        Coming in {phase} — not implemented yet
      </span>
    </div>
  );
}
