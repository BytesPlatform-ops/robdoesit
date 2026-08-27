import { slots } from "@/data/media";
import { MediaTile } from "@/components/video/MediaTile";
import { Label } from "@/components/ui/Label";
import { LineReveal, Rise, MediaReveal, WordReveal } from "@/components/ui/Reveal";

export function Statement() {
  return (
    <section className="relative bg-obsidian py-24 sm:py-32">
      <div className="mx-auto max-w-[1800px] px-5 sm:px-8">
        <LineReveal
          lines={[
            "A MIC.",
            "A CAMERA.",
            <span key="z" className="foil">
              AND ZERO INTEREST IN
            </span>,
            <span key="b" className="foil">
              BORING CONVERSATIONS.
            </span>,
          ]}
          className="display text-[clamp(2.25rem,6.5vw,6.5rem)]"
        />
      </div>
    </section>
  );
}

export function Story() {
  const montage = slots.aboutIdeaMontage;

  return (
    <section className="relative bg-ink py-24 sm:py-32" aria-labelledby="story">
      <div className="mx-auto max-w-[1800px] px-5 sm:px-8">
        <Label className="mb-8">THE STORY</Label>
        <h2 id="story" className="sr-only">
          How ROB DOES IT started
        </h2>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="lg:pt-12">
            <WordReveal
              as="p"
              text="IT STARTED WITH A PHONE AND A SIDEWALK."
              className="display text-[clamp(1.75rem,4.5vw,4rem)] leading-[0.95]"
            />
            <Rise delay={0.1}>
              <p className="mt-8 max-w-md text-lg leading-relaxed text-ivory/70">
                Rob went into Hollywood and started talking to people. No crew,
                no permission, no script — just a question and whoever was
                willing to answer it.
              </p>
            </Rise>

            <MediaReveal className="mt-12">
              <MediaTile
                item={slots.aboutStoryStreet}
                ratio="4:5"
                sizes="(max-width:1024px) 100vw, 46vw"
              >
                <span className="mono pointer-events-none absolute bottom-4 left-4 z-10 text-gold">
                  THE STREET ERA
                </span>
              </MediaTile>
            </MediaReveal>
          </div>

          <div>
            <MediaReveal>
              <MediaTile
                item={slots.aboutStoryGrown}
                ratio="4:5"
                sizes="(max-width:1024px) 100vw, 46vw"
              >
                <span className="mono pointer-events-none absolute bottom-4 left-4 z-10 text-gold">
                  FULL PRODUCTION
                </span>
              </MediaTile>
            </MediaReveal>

            <div className="mt-12">
              <WordReveal
                as="p"
                text="THEN THE FORMAT GREW UP."
                className="display text-[clamp(1.75rem,4.5vw,4rem)] leading-[0.95]"
              />
              <Rise delay={0.1}>
                <p className="mt-8 max-w-md text-lg leading-relaxed text-ivory/70">
                  The audience grew. The production got sharper. Street
                  interviews turned into events, entertainment, red carpets,
                  artists, fashion, professional event partnerships and
                  podcasts.
                </p>
              </Rise>
            </div>
          </div>
        </div>

        <div className="mt-24 border-t border-hairline pt-16">
          <LineReveal
            lines={["BUT THE IDEA NEVER MOVED:", <span key="c" className="text-gold">CREATE REAL MOMENTS PEOPLE WANT TO WATCH.</span>]}
            className="display text-[clamp(1.75rem,4.5vw,4.5rem)]"
          />

          {/* interview · event · fashion · street, side by side */}
          <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {montage.map((item, i) => (
              <li key={item.id}>
                <Rise delay={i * 0.06}>
                  <MediaTile
                    item={item}
                    playlist={montage}
                    index={i}
                    ratio="9:16"
                    sizes="(max-width: 1024px) 48vw, 23vw"
                  >
                    <span className="mono pointer-events-none absolute bottom-3 left-3 z-10 text-ivory/80">
                      {item.category.replace("-", " ").toUpperCase()}
                    </span>
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian/80 to-transparent" />
                  </MediaTile>
                </Rise>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
