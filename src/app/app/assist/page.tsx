import type { Metadata } from "next";
import Link from "next/link";
import { Ear, Eye, MessageCircle, ChevronRight } from "lucide-react";

export const metadata: Metadata = { title: "Assist — SANAD" };

const LINKS = [
  { href: "/app/hearing", title: "Hearing Assistance", icon: Ear },
  { href: "/app/vision", title: "Vision Assistance", icon: Eye },
  { href: "/app/speech", title: "Speech Assistance", icon: MessageCircle },
];

export default function AssistPage() {
  return (
    <div className="space-y-4 pb-4 pt-4">
      <h1 className="text-2xl font-semibold tracking-tight text-text-primary">Assist</h1>
      <div className="space-y-2.5">
        {LINKS.map(({ href, title, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3.5 rounded-2xl border border-border bg-surface px-4 py-4 transition-colors hover:bg-surface-soft"
          >
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-surface-soft text-brand-700">
              <Icon aria-hidden="true" className="size-6" />
            </div>
            <span className="flex-1 font-medium text-text-primary">{title}</span>
            <ChevronRight aria-hidden="true" className="size-5 text-text-muted" />
          </Link>
        ))}
      </div>
    </div>
  );
}
