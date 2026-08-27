import { cn } from "@/lib/utils";

/* ============================================================
   ROB DOES IT — WORDMARK
   The mic glyph + stacked type below is the working identity.
   If an official logo file is supplied, drop it at
   /public/logos/robdoesit.svg and swap the <Mic/> + type here;
   every usage on the site flows through this one component.
   ============================================================ */

export function Mic({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("h-full w-auto", className)}
      aria-hidden
    >
      <rect x="8.6" y="1.8" width="6.8" height="12" rx="3.4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10.4 5.2h3.2M10.4 7.6h3.2M10.4 10h3.2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity=".65" />
      <path d="M5.4 11.2a6.6 6.6 0 0 0 13.2 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 17.8v4.4M8.4 22.2h7.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({
  variant = "full",
  className,
  compact = false,
}: {
  variant?: "full" | "mark" | "mono";
  className?: string;
  compact?: boolean;
}) {
  if (variant === "mark") {
    return (
      <span className={cn("block h-8 text-gold", className)}>
        <Mic />
        <span className="sr-only">ROB DOES IT</span>
      </span>
    );
  }

  const gold = variant === "mono" ? "text-current" : "text-gold";

  return (
    <span className={cn("flex items-center gap-2.5 leading-none", className)}>
      <span
        className={cn(
          "block transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          gold,
          compact ? "h-6" : "h-8",
        )}
      >
        <Mic />
      </span>
      <span
        className={cn(
          "display block transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          compact ? "text-xl" : "text-2xl",
        )}
      >
        <span className="tracking-[0.02em]">ROB DOES IT</span>
        <span className={gold}>.</span>
      </span>
      <span className="sr-only">— host, interviewer, professional crowd mover</span>
    </span>
  );
}

/** Oversized stacked lockup used in the footer and page transitions. */
export function LogoStack({ className }: { className?: string }) {
  return (
    <span className={cn("display block leading-[0.78]", className)} aria-label="ROB DOES IT">
      <span className="block">ROB</span>
      <span className="block">DOES</span>
      <span className="block">
        IT<span className="text-gold">.</span>
      </span>
    </span>
  );
}
