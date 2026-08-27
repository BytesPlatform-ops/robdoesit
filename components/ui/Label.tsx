import { cn } from "@/lib/utils";

/** Small monospace editorial label with a gold tick. */
export function Label({
  children,
  className,
  tone = "gold",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "gold" | "steel";
}) {
  return (
    <span
      className={cn(
        "mono inline-flex items-center gap-3",
        tone === "gold" ? "text-gold" : "text-steel",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "h-px w-8",
          tone === "gold" ? "bg-gold/60" : "bg-steel/50",
        )}
      />
      {children}
    </span>
  );
}
