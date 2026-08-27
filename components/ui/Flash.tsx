"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Red-carpet camera flash between two sections. Under 100ms, fires once
 * when scrolled into view, and never repeats — no strobing, ever.
 */
export function Flash() {
  const reduced = useReducedMotion();
  if (reduced) return <div className="rule-gold mx-auto max-w-[1800px] opacity-40" />;

  return (
    <div className="relative h-px w-full" aria-hidden>
      <motion.div
        className="pointer-events-none absolute inset-x-0 -top-[50svh] z-50 h-[100svh] bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: [0, 0.16, 0] }}
        viewport={{ once: true, amount: 1 }}
        transition={{ duration: 0.09, times: [0, 0.35, 1] }}
      />
      <div className="rule-gold mx-auto max-w-[1800px] opacity-40" />
    </div>
  );
}
