"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { filters, filterMedia, type FilterId } from "@/data/media";
import { ReelCard } from "@/components/video/ReelCard";
import { useViewer } from "@/components/video/ViewerContext";
import { EASE_CINE } from "@/lib/animations";
import { cn } from "@/lib/utils";

const BATCH = 12;

export function Library() {
  const { open } = useViewer();
  const [active, setActive] = useState<FilterId>("all");
  const [count, setCount] = useState(BATCH);

  /* Vertical cards first, then landscape. Every row then holds cards of one
     shape, so tops and bottoms align exactly — the old CSS-columns masonry
     staggered them and made cards look randomly higher or lower. */
  const filtered = useMemo(() => {
    const list = filterMedia(active);
    const weight = (m: (typeof list)[number]) =>
      m.orientation === "landscape" ? 1 : 0;
    return [...list].sort((a, b) => weight(a) - weight(b));
  }, [active]);
  const shown = filtered.slice(0, count);
  const more = filtered.length - shown.length;

  const pickFilter = (id: FilterId) => {
    setActive(id);
    setCount(BATCH);
  };

  return (
    <section className="relative bg-obsidian pb-28" aria-labelledby="library">
      <h2 id="library" className="sr-only">
        All videos
      </h2>

      <div className="sticky top-[64px] z-40 border-y border-hairline bg-obsidian/88 backdrop-blur-xl">
        <div
          className="no-bar mx-auto flex max-w-[1800px] gap-1 overflow-x-auto px-5 py-3 sm:px-8"
          role="group"
          aria-label="Filter videos by category"
        >
          {filters.map((f) => {
            const on = active === f.id;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={on}
                onClick={() => pickFilter(f.id)}
                className={cn(
                  "relative shrink-0 px-4 py-2.5 font-mono text-[0.68rem] uppercase tracking-[0.18em] transition-colors duration-300",
                  on ? "text-gold" : "text-steel hover:text-ivory",
                )}
              >
                {f.label}
                {on && (
                  <motion.span
                    layoutId="filter-underline"
                    className="absolute inset-x-2 -bottom-px h-px bg-gold"
                    transition={{ duration: 0.4, ease: EASE_CINE }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mx-auto max-w-[1800px] px-5 pt-10 sm:px-8">
        <p className="mono mb-8 text-steel-dk" aria-live="polite">
          SHOWING {shown.length} / {filtered.length}
        </p>

        {/* Aligned grid: two columns on phones, four from large up. Landscape
            cards take two columns so they keep 16:9 without breaking the row. */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <AnimatePresence initial={false}>
            {shown.map((item, i) => {
              const landscape = item.orientation === "landscape";
              /* start the landscape block on a fresh row so the last
                 vertical row never leaves a gap beside a shorter card */
              const startsLandscapeBlock =
                landscape && shown[i - 1]?.orientation !== "landscape";
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.5, ease: EASE_CINE, delay: Math.min(i, 8) * 0.03 }}
                  className={
                    landscape
                      ? `col-span-2${startsLandscapeBlock ? " col-start-1" : ""}`
                      : undefined
                  }
                >
                  <ReelCard
                    item={item}
                    ratio={landscape ? "16:9" : "9:16"}
                    priority={i < 4}
                    sizes={
                      landscape
                        ? "(max-width: 1024px) 92vw, 46vw"
                        : "(max-width: 1024px) 46vw, 23vw"
                    }
                    onOpen={() => open(shown, i)}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {more > 0 && (
          <div className="mt-14 flex justify-center">
            <button
              type="button"
              onClick={() => setCount((c) => c + BATCH)}
              data-cursor="MORE"
              className="group inline-flex items-center gap-3 border border-gold/40 px-9 py-5 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-gold transition-colors duration-300 hover:bg-gold hover:text-obsidian"
            >
              LOAD MORE
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-y-0.5">
                ↓
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
