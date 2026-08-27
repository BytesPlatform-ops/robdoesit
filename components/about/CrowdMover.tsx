import { slots } from "@/data/media";
import { Frame } from "@/components/video/Frame";
import { MediaTile } from "@/components/video/MediaTile";
import { Label } from "@/components/ui/Label";
import { LineReveal, Rise } from "@/components/ui/Reveal";

const moves = [
  "He starts conversations.",
  "He creates reactions.",
  "He brings out personality.",
  "He gets people talking.",
  "Then he turns all of it into content.",
];

const playlist = [slots.aboutCrowdMover, slots.aboutCrowdSupport];

export function CrowdMover() {
  return (
    <section className="relative isolate overflow-hidden bg-obsidian py-24 sm:py-32" aria-labelledby="crowd-mover">
      <div className="absolute inset-0 -z-10 opacity-30">
        <Frame
          item={slots.aboutCrowdMover}
          ratio="16:9"
          fit="ambient"
          className="!aspect-auto h-full w-full"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-obsidian/60 to-obsidian" />
      </div>

      <div className="mx-auto max-w-[1800px] px-5 sm:px-8">
        <Label className="mb-8">THE JOB TITLE NOBODY ELSE HAS</Label>
        <LineReveal
          as="h2"
          id="crowd-mover"
          lines={["PROFESSIONAL", "CROWD", <span key="m" className="foil">MOVER.</span>]}
          className="display t-hero"
        />

        <div className="mt-20 grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div className="space-y-8">
            <Rise>
              <p className="display text-[clamp(1.5rem,3vw,2.5rem)] leading-tight text-steel">
                A VIDEOGRAPHER WATCHES THE MOMENT.
              </p>
            </Rise>
            <Rise delay={0.12}>
              <p className="display text-[clamp(1.75rem,3.6vw,3rem)] leading-tight text-ivory">
                ROB GETS INSIDE THE MOMENT.
              </p>
            </Rise>

            <Rise delay={0.2}>
              <div className="grid grid-cols-2 gap-4 pt-4">
                {playlist.map((item, i) => (
                  <MediaTile
                    key={item.id}
                    item={item}
                    playlist={playlist}
                    index={i}
                    ratio="9:16"
                    sizes="(max-width: 1024px) 46vw, 24vw"
                  >
                    <span className="mono pointer-events-none absolute bottom-3 left-3 z-10 text-gold">
                      {i === 0 ? "DOING THE ROB" : "IN THE ROOM"}
                    </span>
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian/80 to-transparent" />
                  </MediaTile>
                ))}
              </div>
            </Rise>
          </div>

          <ol className="border-t border-hairline">
            {moves.map((m, i) => (
              <li key={m} className="border-b border-hairline">
                <Rise delay={i * 0.06}>
                  <div className="flex items-baseline gap-5 py-5">
                    <span className="mono text-gold/70">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-xl leading-snug text-ivory/85">{m}</span>
                  </div>
                </Rise>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-24">
          <LineReveal
            lines={["THE CAMERA CAPTURES IT.", <span key="r" className="text-gold">ROB MAKES IT HAPPEN.</span>]}
            className="display t-section"
          />
        </div>
      </div>
    </section>
  );
}
