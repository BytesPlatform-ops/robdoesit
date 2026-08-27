"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { slots } from "@/data/media";
import { site, bookCta } from "@/data/site";
import { HeroMedia } from "@/components/video/HeroMedia";
import type { ShowreelSources } from "@/lib/showreel";
import { LineReveal } from "@/components/ui/Reveal";
import { EASE_CINE } from "@/lib/animations";

export function Hero({ sources }: { sources: ShowreelSources }) {
  const section = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end start"],
  });

  /* the showreel eases back from full-bleed to a framed 90vw plate */
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const radius = useTransform(scrollYProgress, [0, 1], [0, 26]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={section} className="relative h-[132svh]" aria-label="ROB DOES IT showreel">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div
          style={{ scale, borderRadius: radius }}
          className="vignette absolute inset-0 overflow-hidden bg-ink"
        >
          <HeroMedia item={slots.hero} sources={sources} className="absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian/85 via-obsidian/55 to-obsidian/95" />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian/85 via-obsidian/30 to-obsidian/45" />
        </motion.div>

        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="relative z-10 mx-auto flex h-full max-w-[1800px] flex-col justify-between px-5 pb-8 pt-28 sm:px-8 sm:pb-12 sm:pt-32"
        >
          <motion.p
            className="mono text-gold"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE_CINE }}
          >
            {site.location}
          </motion.p>

          <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:items-end">
            <LineReveal
              as="h1"
              animate
              lines={[
                "ROB",
                "DOES",
                <span key="it">
                  IT<span className="text-gold">.</span>
                </span>,
              ]}
              className="display t-hero"
              delay={1}
            />

            <div className="flex flex-col gap-7 lg:pb-4">
              <motion.p
                className="mono text-ivory/75"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: EASE_CINE }}
              >
                {site.roles.join(" / ")}
              </motion.p>

              <motion.p
                className="display text-[clamp(1.6rem,3vw,2.6rem)] leading-[0.95] text-ivory"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.58, ease: EASE_CINE }}
              >
                HOLLYWOOD, LET&apos;S GET IT.
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-3"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.66, ease: EASE_CINE }}
              >
                <Link
                  href="/watch"
                  data-cursor="WATCH"
                  className="group inline-flex items-center gap-3 bg-ivory px-7 py-4 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-obsidian transition-colors duration-300 hover:bg-gold-hi"
                >
                  WATCH ROB
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
                <Link
                  href={bookCta.href}
                  data-cursor="LET'S GO"
                  className="inline-flex items-center border border-gold/45 px-7 py-4 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-gold transition-colors duration-300 hover:border-gold hover:bg-gold hover:text-obsidian"
                >
                  {bookCta.label}
                </Link>
              </motion.div>
            </div>
          </div>

          <motion.div
            className="mt-8 flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <span className="mono text-steel">SCROLL TO ENTER</span>
            <motion.span
              aria-hidden
              className="block h-10 w-px bg-gradient-to-b from-gold to-transparent"
              animate={{ scaleY: [0.4, 1, 0.4], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: "top" }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
