import { cn } from "@/lib/utils";

/**
 * Seamless CSS marquee. The children are rendered twice inside a
 * max-content track and translated -50%, so the loop has no seam.
 * Freezes entirely under prefers-reduced-motion (see globals.css).
 */
export function Marquee({
  children,
  duration = 40,
  direction = "left",
  pauseOnHover = false,
  className,
}: {
  children: React.ReactNode;
  duration?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn("marquee relative overflow-hidden", className)}
      style={
        {
          "--marquee-dur": `${duration}s`,
          "--marquee-hover": pauseOnHover ? "paused" : "running",
        } as React.CSSProperties
      }
    >
      <div className="marquee-track" data-dir={direction}>
        <div className="flex shrink-0 items-center" aria-hidden={false}>
          {children}
        </div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
