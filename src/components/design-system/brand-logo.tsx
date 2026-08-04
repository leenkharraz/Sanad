import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The official SANAD lockup (glasses + Arabic سند + SANAD wordmark),
 * exported from the Figma brand asset at /public/assets/sanad-logo.png.
 * This is the only brand mark used anywhere in the app — never redrawn.
 */
export function BrandLogo({
  className,
  variant = "full",
  priority,
}: {
  className?: string;
  variant?: "full" | "mark";
  priority?: boolean;
}) {
  if (variant === "mark") {
    // Compact square treatment for tight spaces (e.g. a sidebar rail):
    // crops into the glasses portion of the real asset rather than
    // inventing a separate icon-only mark.
    return (
      <span
        className={cn("relative block size-10 overflow-hidden rounded-xl bg-surface", className)}
      >
        <Image
          src="/assets/sanad-logo.png"
          alt="SANAD"
          fill
          unoptimized
          sizes="64px"
          priority={priority}
          className="scale-[2.15] object-cover object-[50%_18%]"
        />
      </span>
    );
  }

  return (
    <Image
      src="/assets/sanad-logo.png"
      alt="SANAD"
      width={461}
      height={308}
      unoptimized
      priority={priority}
      className={cn("h-16 w-auto object-contain", className)}
    />
  );
}
