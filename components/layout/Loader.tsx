"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useSyncExternalStore } from "react";
import { EASE_CINE } from "@/lib/animations";
import { Mic } from "./Logo";

const KEY = "rdi:entered";
const HOLD = 1150;

/* Tiny external store: whether the opener should be on screen. Decided once
   per session so a cached return visit goes straight to the content. */
let decided = false;
let visible = false;
const listeners = new Set<() => void>();

function snapshot() {
  if (!decided) {
    decided = true;
    try {
      visible = sessionStorage.getItem(KEY) !== "1";
    } catch {
      visible = false; // storage blocked — never hold content back
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      visible = false;
    }
  }
  return visible;
}

function dismiss() {
  visible = false;
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {}
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

/** First-visit opener. Under ~1.2s, and skipped entirely once cached. */
export function Loader() {
  const show = useSyncExternalStore(subscribe, snapshot, () => false);

  useEffect(() => {
    if (!show) return;
    document.body.style.overflow = "hidden";
    const t = setTimeout(dismiss, HOLD);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-100 flex items-center justify-center bg-obsidian"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.7, ease: EASE_CINE }}
          aria-hidden
        >
          <div className="flex flex-col items-center gap-6">
            <motion.span
              className="block h-9 text-gold"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE_CINE }}
            >
              <Mic />
            </motion.span>

            <motion.span
              className="block h-px bg-gold"
              initial={{ width: 0 }}
              animate={{ width: 120 }}
              transition={{ duration: 0.55, delay: 0.12, ease: EASE_CINE }}
            />

            <div className="display text-center text-[clamp(2.5rem,9vw,5rem)] leading-[0.82]">
              {["ROB", "DOES", "IT"].map((w, i) => (
                <span key={w} className="block overflow-hidden">
                  <motion.span
                    className="block"
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.6, delay: 0.2 + i * 0.07, ease: EASE_CINE }}
                  >
                    {w}
                  </motion.span>
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
