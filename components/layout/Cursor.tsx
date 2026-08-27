"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "motion/react";
import { useMediaQuery, useReducedMotionPref } from "@/lib/hooks";

/**
 * Desktop-only custom cursor. Never replaces the native cursor on touch
 * devices, and stays out of the way of keyboard focus. Any element can
 * set its own label with data-cursor="WATCH".
 */
export function Cursor() {
  const fine = useMediaQuery("(pointer: fine)");
  const reduced = useReducedMotionPref();
  const enabled = fine && !reduced;
  const [label, setLabel] = useState<string | null>(null);
  const [down, setDown] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 900, damping: 60, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 900, damping: 60, mass: 0.35 });

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-cursor");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = (e.target as HTMLElement)?.closest?.("[data-cursor]");
      setLabel(el ? el.getAttribute("data-cursor") : null);
    };
    const dn = () => setDown(true);
    const up = () => setDown(false);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", dn);
    window.addEventListener("pointerup", up);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", dn);
      window.removeEventListener("pointerup", up);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-110 mix-blend-difference"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="relative -translate-x-1/2 -translate-y-1/2"
        animate={{ scale: down ? 0.85 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <AnimatePresence mode="wait">
          {label ? (
            <motion.span
              key={label}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="flex h-20 w-20 items-center justify-center rounded-full border border-white/70 bg-white/10 px-2 text-center font-mono text-[0.55rem] uppercase leading-tight tracking-[0.18em] text-white backdrop-blur-[1px]"
            >
              {label}
            </motion.span>
          ) : (
            <motion.span
              key="dot"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="block h-2.5 w-2.5 rounded-full bg-white"
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
