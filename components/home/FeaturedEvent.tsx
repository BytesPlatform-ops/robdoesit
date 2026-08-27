import Link from "next/link";
import { slots } from "@/data/media";
import { Frame } from "@/components/video/Frame";
import { MediaTile } from "@/components/video/MediaTile";
import { Label } from "@/components/ui/Label";
import { LineReveal, Rise, MediaReveal } from "@/components/ui/Reveal";

const outputs = [
  "INTERVIEWS",
  "CROWD",
  "VENUE",
  "RED CARPET",
  "SOCIAL CUTS",
  "HIGHLIGHT FILM",
];

/* the wide plate plus the floating cuts, as one viewer playlist */
const playlist = [slots.featuredEventWide, ...slots.featuredEventFloats];

/* Desktop placement of the three floating cuts. Equal widths and a
   symmetric baseline — a deliberate composition, not three ad-hoc offsets.
   Each frame carries its own aspect ratio, so nothing shifts as media loads. */
const floatPos = [
  "left-[5%] -bottom-12 w-[13%]",
  "left-1/2 -translate-x-1/2 -bottom-20 w-[13%]",
  "right-[5%] -bottom-12 w-[13%]",
];

export function FeaturedEvent() {
  return (
    <section className="relative bg-obsidian py-24 sm:py-32" aria-labelledby="one-night">
      <div className="mx-auto max-w-[1800px] px-5 sm:px-8">
        <Label className="mb-8">ONE EVENT / A FULL LIBRARY</Label>

        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <LineReveal
            as="h2"
            id="one-night"
            lines={["ONE NIGHT.", "DOZENS OF MOMENTS.", "WEEKS OF CONTENT."]}
            className="display t-section"
          />
          <Rise delay={0.1}>
            <p className="max-w-md text-lg leading-relaxed text-ivory/70">
              Rob transforms one live experience into a full library of
              social-first content.
            </p>
          </Rise>
        </div>
      </div>

      {/* cinematic plate with floating vertical cuts */}
      <div className="relative mt-16 sm:mt-20">
        <MediaReveal className="mx-auto max-w-[1800px] px-5 sm:px-8">
          <div className="relative">
            <Frame
              item={slots.featuredEventWide}
              ratio="16:9"
              fit="letterbox"
              sizes="100vw"
              className="min-h-[46svh]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian/70 via-transparent to-obsidian/20" />
          </div>
        </MediaReveal>

        {/* overlapping reels — desktop */}
        <div className="pointer-events-none absolute inset-0 hidden lg:block">
          <div className="mx-auto h-full max-w-[1800px] px-8">
            <div className="relative h-full">
              {slots.featuredEventFloats.map((item, i) => (
                <div
                  key={item.id}
                  className={`pointer-events-auto absolute shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] ${floatPos[i]}`}
                >
                  <MediaTile
                    item={item}
                    playlist={playlist}
                    index={i + 1}
                    ratio="9:16"
                    sizes="16vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* mobile reels row */}
      <div className="mt-5 grid grid-cols-3 gap-3 px-5 sm:px-8 lg:hidden">
        {slots.featuredEventFloats.map((item, i) => (
          <MediaTile
            key={item.id}
            item={item}
            playlist={playlist}
            index={i + 1}
            ratio="9:16"
            sizes="31vw"
          />
        ))}
      </div>

      <div className="mx-auto mt-16 max-w-[1800px] px-5 sm:px-8 lg:mt-36">
        <ul className="flex flex-wrap gap-2.5">
          {outputs.map((o, i) => (
            <li key={o}>
              <Rise delay={i * 0.04}>
                <span className="mono block border border-hairline-strong px-4 py-2.5 text-ivory/70 transition-colors hover:border-gold/50 hover:text-gold">
                  {o}
                </span>
              </Rise>
            </li>
          ))}
        </ul>

        <Rise delay={0.2}>
          <Link
            href="/work-with-rob"
            data-cursor="LET'S GO"
            className="group mt-10 inline-flex items-center gap-3 border-b border-gold/40 pb-2 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-gold transition-colors hover:border-gold"
          >
            SEE HOW IT WORKS
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </Rise>
      </div>
    </section>
  );
}
