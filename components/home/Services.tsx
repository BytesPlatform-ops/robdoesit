"use client";

import Link from "next/link";
import { useRef } from "react";
import { useMediaQuery } from "@/lib/hooks";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { packages, type Pack } from "@/data/packages";
import { slots, type MediaItem } from "@/data/media";
import { Frame } from "@/components/video/Frame";
import { Label } from "@/components/ui/Label";
import { LineReveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/* real footage behind each package, revealed on hover */
const packMedia: Record<Pack["id"], MediaItem> = {
  spotlight: slots.packageSpotlight,
  momentum: slots.packageMomentum,
  legacy: slots.packageLegacy,
};

/* the deck starts stacked and fans out as it scrolls into place */
const DECK = [
  { x: 16, y: 26, r: -3.5 },
  { x: 0, y: 0, r: 0 },
  { x: -16, y: 26, r: 3.5 },
];

function Card({
  pack,
  i,
  progress,
  fan,
  detailed,
}: {
  pack: Pack;
  i: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  fan: boolean;
  detailed?: boolean;
}) {
  const d = DECK[i] ?? DECK[1];
  const x = useTransform(progress, [0, 1], [`${d.x}%`, "0%"]);
  const y = useTransform(progress, [0, 1], [d.y, 0]);
  const rotate = useTransform(progress, [0, 1], [d.r, 0]);
  const scale = useTransform(progress, [0, 1], [0.94, pack.popular ? 1.03 : 1]);

  return (
    <motion.article
      style={fan ? { x, y, rotate, scale } : undefined}
      className={cn(
        "group relative flex flex-col",
        pack.popular ? "z-20" : "z-10",
      )}
    >
      <div
        className={cn(
          "edge-metal relative flex h-full flex-col overflow-hidden border bg-ink",
          pack.popular ? "border-gold/40" : "border-hairline-strong",
        )}
      >
        {/* real footage behind the card, brought up on hover */}
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-[0.34]">
          <Frame
            item={packMedia[pack.id]}
            ratio="4:5"
            fit="ambient"
            className="!aspect-auto h-full w-full"
            sizes="(max-width: 1024px) 100vw, 32vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/70" />
        </div>

        {/* travelling light reflection */}
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-y-10 -left-1/3 w-1/3 -translate-x-full rotate-12 bg-gradient-to-r from-transparent via-white/8 to-transparent transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[420%]"
        />

        {/* credential header */}
        <div className="relative flex items-center justify-between border-b border-dashed border-hairline-strong px-6 py-4">
          <span className="mono text-steel">ACCESS {pack.index}</span>
          {pack.popular ? (
            <span className="mono bg-gold px-2.5 py-1 text-obsidian">MOST POPULAR</span>
          ) : (
            <span className="mono text-steel-dk">ROB DOES IT</span>
          )}
        </div>

        <div className="relative flex flex-1 flex-col px-6 pb-6 pt-7">
          <h3 className="display text-[clamp(2.5rem,5vw,3.75rem)] leading-none">
            {pack.name}
          </h3>
          <p className="mono mt-2 text-gold">{pack.tagline}</p>

          <p className="mt-7 flex items-baseline gap-2">
            <span className="display text-[clamp(3rem,6vw,4.5rem)] leading-none">
              ${pack.price}
            </span>
            <span className="mono text-steel">{pack.currency}</span>
          </p>

          {detailed && (
            <p className="mt-5 leading-relaxed text-ivory/65">{pack.summary}</p>
          )}

          <div className="rule-gold my-7 opacity-50" />

          <ul className="flex-1 space-y-3">
            {pack.includes.map((inc) => (
              <li key={inc} className="flex gap-3 text-[0.95rem] leading-snug text-ivory/75">
                <span aria-hidden className="mt-2 h-px w-3 shrink-0 bg-gold" />
                {inc}
              </li>
            ))}
          </ul>

          <Link
            href="/work-with-rob#booking"
            data-cursor="LET'S GO"
            className={cn(
              "group/cta mt-8 inline-flex items-center justify-between gap-3 px-6 py-4 font-mono text-[0.7rem] uppercase tracking-[0.2em] transition-colors duration-300",
              pack.popular
                ? "bg-gold text-obsidian hover:bg-gold-hi"
                : "border border-gold/40 text-gold hover:bg-gold hover:text-obsidian",
            )}
          >
            {pack.cta}
            <span aria-hidden className="transition-transform duration-300 group-hover/cta:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export function Services({
  detailed = false,
  heading = ["BRING ROB", "TO YOUR EVENT."],
  label = "SERVICES / PACKAGES",
}: {
  detailed?: boolean;
  heading?: string[];
  label?: string;
}) {
  const section = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const wide = useMediaQuery("(min-width: 1024px)");

  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start 0.95", "center 0.6"],
  });

  const fan = wide && !reduced;

  return (
    <section
      ref={section}
      id="packages"
      className="relative bg-obsidian py-24 sm:py-32"
      aria-labelledby="services"
    >
      <div className="mx-auto max-w-[1800px] px-5 sm:px-8">
        <Label className="mb-8">{label}</Label>
        <LineReveal as="h2" id="services" lines={heading} className="display t-section" />

        <div className="mt-16 grid gap-6 lg:mt-24 lg:grid-cols-3 lg:gap-5">
          {packages.map((p, i) => (
            <Card
              key={p.id}
              pack={p}
              i={i}
              progress={scrollYProgress}
              fan={fan}
              detailed={detailed}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
