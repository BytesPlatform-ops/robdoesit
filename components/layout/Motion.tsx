"use client";

import { MotionConfig } from "motion/react";

/**
 * Honours the visitor's OS motion setting for every JS-driven animation
 * on the site — transforms and layout shifts are dropped, opacity stays,
 * so the story still reveals without anything flying around.
 */
export function Motion({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </MotionConfig>
  );
}
