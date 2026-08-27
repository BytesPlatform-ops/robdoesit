import { slots } from "@/data/media";
import { MediaTile } from "@/components/video/MediaTile";
import { Label } from "@/components/ui/Label";
import { LineReveal, Rise } from "@/components/ui/Reveal";

const pillars = [
  {
    index: "01",
    title: "HOST",
    body: "Rob brings the energy to the room. He works the floor, reads the crowd and keeps the night moving.",
    item: slots.pillarHost,
  },
  {
    index: "02",
    title: "INTERVIEW",
    body: "Real conversations with personalities, artists and guests — the kind people actually finish watching.",
    item: slots.pillarInterview,
  },
  {
    index: "03",
    title: "CREATE",
    body: "The night becomes vertical social content that keeps working long after the lights go down.",
    item: slots.pillarCreate,
  },
];

const playlist = pillars.map((p) => p.item);

export function WhatRobDoes() {
  return (
    <section className="relative bg-obsidian py-24 sm:py-32" aria-labelledby="what-rob-does">
      <div className="mx-auto max-w-[1800px] px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-end">
          <div>
            <Label className="mb-8">WHAT DOES ROB DO?</Label>
            <LineReveal
              as="h2"
              id="what-rob-does"
              lines={[
                "HE DOESN'T JUST",
                "COVER THE EVENT.",
                <span key="moves" className="foil">
                  HE MOVES IT.
                </span>,
              ]}
              className="display t-section"
            />
          </div>

          <Rise delay={0.15}>
            <p className="max-w-md text-lg leading-relaxed text-ivory/70">
              Rob brings the microphone, the personality and the camera together
              to create moments people actually want to watch.
            </p>
          </Rise>
        </div>

        <ul className="mt-16 grid gap-6 md:grid-cols-3 md:gap-5">
          {pillars.map((p, i) => (
            <li key={p.title}>
              <Rise delay={i * 0.08}>
                <article className="group">
                  <MediaTile
                    item={p.item}
                    playlist={playlist}
                    index={i}
                    ratio="4:5"
                    /* 4:5 keeps growing with the column, so past ~1280px these
                       plates were ~700px tall and swallowed the viewport. From
                       md up the height is fixed and the width still fills the
                       column (a max-height alone makes aspect-ratio shrink the
                       width too, which left gaps between the cards). */
                    frameClassName="w-full md:h-[20rem] lg:h-[24rem] xl:h-[27rem]"
                    sizes="(max-width: 768px) 100vw, 32vw"
                  >
                    {/* the reels carry their own burnt-in captions, so the
                        lower third fades harder to keep our label readable */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/55 to-transparent" />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between p-5">
                      <h3 className="display text-[clamp(2.25rem,4vw,3.25rem)] leading-none">
                        {p.title}
                      </h3>
                      <span className="mono text-gold">{p.index}</span>
                    </div>
                  </MediaTile>
                  <p className="mt-5 max-w-sm leading-relaxed text-ivory/65 transition-colors duration-300 group-hover:text-ivory/85">
                    {p.body}
                  </p>
                </article>
              </Rise>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
