"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useScrolled } from "@/lib/hooks";
import { bookCta } from "@/data/site";
import { EASE_CINE } from "@/lib/animations";

/**
 * Thumb-reachable booking action on small screens. Appears only after the
 * hero, and never on the page that already is the booking flow.
 */
export function BookBar() {
  const pathname = usePathname();
  const show = useScrolled(0.9, "vh");

  if (pathname.startsWith("/work-with-rob")) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 90 }}
          animate={{ y: 0 }}
          exit={{ y: 90 }}
          transition={{ duration: 0.45, ease: EASE_CINE }}
          className="fixed inset-x-0 bottom-0 z-70 border-t border-gold/25 bg-obsidian/92 px-4 py-3 backdrop-blur-xl lg:hidden"
        >
          <Link
            href={bookCta.href}
            className="flex items-center justify-between bg-gold px-5 py-4 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-obsidian"
          >
            {bookCta.label}
            <span aria-hidden>→</span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
