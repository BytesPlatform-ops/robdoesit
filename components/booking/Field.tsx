"use client";

import { cn } from "@/lib/utils";

export function Field({
  label,
  name,
  error,
  hint,
  children,
  className,
}: {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={name} className="mono text-steel">
        {label}
      </label>
      {children}
      {/* Reserved space: validation messages appear and clear as the visitor
          moves through the form, and a row that grows or collapses would
          shift whatever they are about to click. */}
      <p
        id={error ? `${name}-error` : undefined}
        role={error ? "alert" : undefined}
        className={cn(
          "mono min-h-[1.1rem]",
          error ? "text-gold" : "text-steel-dk",
        )}
      >
        {error ?? hint ?? ""}
      </p>
    </div>
  );
}

export const inputClass =
  "w-full border-b border-hairline-strong bg-transparent px-0 py-3.5 font-sans text-lg text-ivory " +
  "placeholder:text-steel-dk transition-colors duration-300 " +
  "focus:border-gold focus:outline-none aria-[invalid=true]:border-gold/70";

/**
 * A chip that is a real radio/checkbox underneath. Keeping the native
 * input means React Hook Form reads the value straight from the DOM
 * rather than from a hand-managed copy that can drift out of sync, and
 * screen readers get proper grouping and selected state for free.
 */
export function Chip({
  active,
  children,
  className,
  ...input
}: { active: boolean; children: React.ReactNode } & React.ComponentProps<"input">) {
  return (
    <label className={cn("cursor-pointer", className)}>
      <input className="peer sr-only" {...input} />
      <span
        className={cn(
          "block border px-4 py-3 font-mono text-[0.68rem] uppercase tracking-[0.16em] transition-all duration-300",
          "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold",
          active
            ? "border-gold bg-gold text-obsidian"
            : "border-hairline-strong text-ivory/70 hover:border-gold/50 hover:text-gold",
        )}
      >
        {children}
      </span>
    </label>
  );
}
