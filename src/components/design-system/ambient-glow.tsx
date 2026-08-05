import { cn } from "@/lib/utils";

/**
 * Theme-aware layered blur/glow used behind hero content (splash, welcome,
 * auth, home header). Reads the --splash-1..5 tokens so Light/Calm get a
 * warm caramel halo and Dark gets a subtle warm glow against charcoal —
 * never a hardcoded hex, never covering readable text.
 */
export function AmbientGlow({
  variant = "hero",
  className,
}: {
  variant?: "hero" | "soft";
  className?: string;
}) {
  if (variant === "soft") {
    return (
      <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
        <div className="absolute -top-16 -left-10 size-48 rounded-full bg-(--splash-1)/30 blur-3xl" />
        <div className="absolute -top-10 right-[-8%] size-56 rounded-full bg-(--splash-3)/35 blur-3xl" />
      </div>
    );
  }

  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="absolute -top-24 -left-16 size-72 rounded-full bg-(--splash-1)/45 blur-3xl" />
      <div className="absolute -top-10 right-0 size-80 rounded-full bg-(--splash-2)/40 blur-3xl" />
      <div className="absolute bottom-[-15%] left-1/2 size-[26rem] -translate-x-1/2 rounded-full bg-(--splash-3)/55 blur-3xl" />
      <div className="absolute right-[-10%] bottom-0 size-72 rounded-full bg-(--splash-4)/60 blur-3xl" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background/85" />
    </div>
  );
}
