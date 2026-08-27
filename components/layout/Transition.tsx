"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useReducedMotionPref } from "@/lib/hooks";
import { EASE_CINE } from "@/lib/animations";

let hasMounted = false;

/**
 * Route transition: a black curtain carrying the wordmark lifts away and
 * a gold line sweeps across. ~700ms — cinematic without feeling slow.
 * Skipped on the very first paint (the loader owns that moment).
 */
export function Transition({ children }: { children: React.ReactNode }) {
  const [first] = useState(() => !hasMounted);
  const reduced = useReducedMotionPref();

  useEffect(() => {
    hasMounted = true;
  }, []);

  const play = !first && !reduced;

  return (
    <>
      {play && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-95 flex items-center justify-center bg-obsidian"
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          animate={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.62, ease: EASE_CINE, delay: 0.14 }}
        >
          <motion.span
            className="display text-[clamp(2rem,7vw,4.5rem)] tracking-[0.02em]"
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.4, ease: EASE_CINE }}
          >
            ROB DOES IT<span className="text-gold">.</span>
          </motion.span>
          <motion.span
            className="absolute left-0 top-1/2 h-px w-full bg-gold"
            initial={{ scaleX: 0, transformOrigin: "left" }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, ease: EASE_CINE }}
          />
        </motion.div>
      )}

      <motion.div
        initial={play ? { opacity: 0, y: 12 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_CINE, delay: play ? 0.3 : 0 }}
      >
        {children}
      </motion.div>
    </>
  );
}
