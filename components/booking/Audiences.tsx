"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { audiences } from "@/data/packages";
import { audienceMedia } from "@/data/media";
import { Frame } from "@/components/video/Frame";
import { Label } from "@/components/ui/Label";
import { LineReveal } from "@/components/ui/Reveal";
import { EASE_CINE } from "@/lib/animations";

export function Audiences() {
  const [active, setActive] = useState(0);
  const activeItem = audienceMedia[audiences[active]];

  return (
    <section className="relative bg-obsidian py-24 sm:py-32" aria-labelledby="who">
      <div className="mx-auto max-w-[1800px] px-5 sm:px-8">
        <Label className="mb-8">WHO THIS IS FOR</Label>
        <LineReveal
          as="h2"
          id="who"
          lines={["IF THERE'S A ROOM,", "THERE'S A REASON."]}
          className="display t-section"
        />

        <div className="mt-16 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <ul className="border-t border-hairline">
            {audiences.map((a, i) => {
              const on = active === i;
              const item = audienceMedia[a];
              return (
                <li key={a} className="border-b border-hairline">
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-expanded={on}
                    className="group flex w-full items-center justify-between gap-6 py-4 text-left sm:py-5"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="mono text-gold/60">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`display text-[clamp(1.6rem,4vw,3rem)] leading-none transition-colors duration-300 ${
                          on ? "text-gold" : "text-ivory/80 group-hover:text-ivory"
                        }`}
                      >
                        {a}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className={`mono transition-all duration-300 ${
                        on ? "translate-x-0 text-gold opacity-100" : "-translate-x-2 opacity-0"
                      }`}
                    >
                      →
                    </span>
                  </button>

                  {/* tap-to-reveal footage on small screens */}
                  <AnimatePresence initial={false}>
                    {on && item && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: EASE_CINE }}
                        className="overflow-hidden lg:hidden"
                      >
                        <div className="pb-5">
                          <Frame
                            item={item}
                            ratio="16:9"
                            fit="ambient"
                            sizes="100vw"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>

          {/* footage panel follows the hovered row — desktop */}
          <div className="relative hidden lg:block">
            <div className="sticky top-32">
              <div className="relative aspect-[4/5] overflow-hidden bg-ink">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeItem?.id ?? active}
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.55, ease: EASE_CINE }}
                    className="absolute inset-0"
                  >
                    {activeItem && (
                      <Frame
                        item={activeItem}
                        ratio="4:5"
                        className="h-full w-full !aspect-auto"
                        sizes="40vw"
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian/70 to-transparent" />
                <span className="mono absolute bottom-4 left-4 z-10 text-gold">
                  {audiences[active]}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
