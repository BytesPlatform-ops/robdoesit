"use client";

import { motion } from "motion/react";
import { lineMask, wordUp, viewportOnce, cine } from "@/lib/animations";
import { cn } from "@/lib/utils";

/** Display type that rises out of a mask, line by line. */
export function LineReveal({
  lines,
  className,
  lineClassName,
  as: Tag = "h2",
  delay = 0,
  animate,
  ...rest
}: {
  lines: React.ReactNode[];
  className?: string;
  lineClassName?: string;
  as?: React.ElementType;
  delay?: number;
  /** Force-play instead of waiting for the viewport (used in heroes). */
  animate?: boolean;
  id?: string;
}) {
  const play = animate ? { animate: "show" } : { whileInView: "show", viewport: viewportOnce };
  return (
    <Tag className={className} {...rest}>
      {lines.map((line, i) => (
        <motion.span
          key={i}
          className="block overflow-hidden"
          initial="hidden"
          {...play}
        >
          <motion.span
            className={cn("block", lineClassName)}
            variants={lineMask}
            custom={i + delay}
          >
            {line}
          </motion.span>
        </motion.span>
      ))}
    </Tag>
  );
}

/** Mid-size headline that assembles word by word. */
export function WordReveal({
  text,
  className,
  as: Tag = "h3",
  ...rest
}: {
  text: string;
  className?: string;
  as?: React.ElementType;
  id?: string;
}) {
  const words = text.split(" ");
  return (
    <Tag className={className} {...rest}>
      {words.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          className="inline-block overflow-hidden align-bottom"
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <motion.span className="inline-block" variants={wordUp} custom={i}>
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </motion.span>
      ))}
    </Tag>
  );
}

/** Restrained entrance for supporting copy. Used sparingly, by design. */
export function Rise({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ ...cine, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Media that settles behind a rising clip mask. */
export function MediaReveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={cn("overflow-hidden", className)}
      initial={{ clipPath: "inset(14% 8% 14% 8%)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
