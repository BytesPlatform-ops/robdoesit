"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from "motion/react";
import { slots } from "@/data/media";
import { Frame } from "@/components/video/Frame";
import { Label } from "@/components/ui/Label";

const beats = [
  "HE WALKS IN.",
  "THE MIC COMES OUT.",
  "THE CROWD OPENS UP.",
  "THE CONTENT STARTS WRITING ITSELF.",
];

function Beat({
  progress,
  range,
  children,
  hold = false,
  className = "",
}: {
  progress: MotionValue<number>;
  range: [number, number];
  children: React.ReactNode;
  hold?: boolean;
  className?: string;
}) {
  const [a, b] = range;
  const span = b - a;
  const opacity = useTransform(
    progress,
    hold ? [a, a + span * 0.35, 1] : [a, a + span * 0.28, b - span * 0.28, b],
    hold ? [0, 1, 1] : [0, 1, 1, 0],
  );
  const y = useTransform(progress, [a, b], [40, -40]);
  const blur = useTransform(opacity, [0, 1], [8, 0]);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);

  return (
    <motion.p
      style={{ opacity, y, filter }}
      className={`absolute inset-x-0 px-5 text-center sm:px-8 ${className}`}
    >
      {children}
    </motion.p>
  );
}

export function RobEffect() {
  const section = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end end"],
  });

  if (reduced) {
    return (
      <section className="relative overflow-hidden bg-ink py-28" aria-labelledby="rob-effect">
        <div className="absolute inset-0 opacity-30">
          <Frame item={slots.robEffect} fit="ambient" className="!aspect-auto h-full w-full" ratio="16:9" sizes="100vw" />
        </div>
        <div className="relative mx-auto max-w-[1100px] px-5 text-center sm:px-8">
          <Label className="mb-10 justify-center">THE ROB EFFECT</Label>
          <h2 id="rob-effect" className="display t-sub mb-12">
            A CAMERA CAN RECORD A ROOM.<br />ROB CHANGES THE ROOM.
          </h2>
          <ul className="space-y-6">
            {beats.map((b) => (
              <li key={b} className="display text-[clamp(1.75rem,4vw,3rem)] text-ivory/80">
                {b}
              </li>
            ))}
          </ul>
          <p className="display mt-14 text-[clamp(2rem,6vw,4.5rem)] text-gold">
            THAT&apos;S THE ROB EFFECT.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section ref={section} className="relative h-[420svh] bg-ink" aria-labelledby="rob-effect">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Frame
            item={slots.robEffect}
            ratio="16:9"
            fit="ambient"
            className="!aspect-auto h-full w-full"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-obsidian/64" />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-transparent to-obsidian" />
        </div>

        <div className="absolute left-0 right-0 top-24 z-10 flex justify-center">
          <Label>THE ROB EFFECT</Label>
        </div>

        <div className="relative z-10 flex h-full w-full items-center justify-center">
          <Beat progress={scrollYProgress} range={[0, 0.2]} className="display t-sub">
            <span id="rob-effect">
              A CAMERA CAN RECORD A ROOM.
              <br />
              ROB CHANGES THE ROOM.
            </span>
          </Beat>

          {beats.map((b, i) => (
            <Beat
              key={b}
              progress={scrollYProgress}
              range={[0.2 + i * 0.15, 0.35 + i * 0.15]}
              className="display text-[clamp(2.25rem,7vw,6rem)] leading-[0.9]"
            >
              {b}
            </Beat>
          ))}

          <Beat
            progress={scrollYProgress}
            range={[0.82, 1]}
            hold
            className="display foil text-[clamp(2.5rem,8vw,7rem)] leading-[0.9]"
          >
            THAT&apos;S THE ROB EFFECT.
          </Beat>
        </div>
      </div>
    </section>
  );
}
