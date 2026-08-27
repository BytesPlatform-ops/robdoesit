import type { Variants, Transition } from "motion/react";

/* Motion language: camera moves and broadcast graphics — not UI fades. */

export const EASE_CINE = [0.16, 1, 0.3, 1] as const;

/** micro 150-250ms · UI 250-450ms · cinematic 500-900ms */
export const DUR = {
  micro: 0.2,
  ui: 0.36,
  cine: 0.75,
} as const;

export const cine: Transition = { duration: DUR.cine, ease: EASE_CINE };

/** Line-by-line mask reveal for display type. */
export const lineMask: Variants = {
  hidden: { y: "110%", rotate: 2 },
  show: (i = 0) => ({
    y: "0%",
    rotate: 0,
    transition: { ...cine, delay: 0.06 * i },
  }),
};

/** Word-by-word reveal for mid-size headlines. */
export const wordUp: Variants = {
  hidden: { y: "100%" },
  show: (i = 0) => ({ y: "0%", transition: { ...cine, delay: 0.035 * i } }),
};

export const viewportOnce = { once: true, amount: 0.35 } as const;
