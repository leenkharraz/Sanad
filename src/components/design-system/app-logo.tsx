import { cn } from "@/lib/utils";

/**
 * SANAD wordmark glyph: glasses frame with a signal/sparkle accent, standing
 * in for the smart-glasses identity until a final brand mark is supplied.
 */
export function AppLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label="SANAD"
      className={cn("text-brand-800", className)}
    >
      <rect width="48" height="48" rx="14" fill="currentColor" />
      <path
        d="M12 27a5 5 0 1 1 10 0 5 5 0 0 1-10 0Zm14 0a5 5 0 1 1 10 0 5 5 0 0 1-10 0Zm-9-1h4"
        stroke="var(--surface)"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="30" cy="14" r="2.4" fill="var(--gold)" />
    </svg>
  );
}
