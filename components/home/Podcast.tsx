import { podcast } from "@/data/podcasts";
import { slots } from "@/data/media";
import { social } from "@/data/socials";
import { MediaTile } from "@/components/video/MediaTile";
import { Label } from "@/components/ui/Label";
import { LineReveal, Rise, MediaReveal } from "@/components/ui/Reveal";

const playlist = [slots.podcastFeatured, ...slots.podcastEpisodes];

export function Podcast() {
  const yt = social("youtube");
  const sp = social("spotify");

  return (
    <section className="relative bg-ink py-24 sm:py-32" aria-labelledby="podcast">
      <div className="mx-auto max-w-[1800px] px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <MediaReveal>
            <MediaTile
              item={slots.podcastFeatured}
              playlist={playlist}
              index={0}
              ratio="16:9"
              cursor="PLAY"
              sizes="(max-width: 1024px) 100vw, 48vw"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
              <span className="pointer-events-none absolute bottom-4 left-4 z-10 flex items-center gap-3">
                <span className="mono border border-gold/40 bg-obsidian/70 px-3 py-2 text-gold backdrop-blur">
                  ▶ FEATURED EPISODE
                </span>
              </span>
            </MediaTile>
          </MediaReveal>

          <div>
            <Label className="mb-8">THE PODCAST</Label>
            <LineReveal
              as="h2"
              id="podcast"
              lines={podcast.headline}
              className="display text-[clamp(2.5rem,5.5vw,5rem)]"
            />

            <Rise delay={0.1}>
              <p className="mt-8 max-w-lg text-lg leading-relaxed text-ivory/70">
                {podcast.body}
              </p>
            </Rise>

            <Rise delay={0.15}>
              <ul className="mt-8 flex flex-wrap gap-2">
                {podcast.guests.map((g) => (
                  <li key={g} className="mono border border-hairline-strong px-3 py-2 text-steel">
                    {g}
                  </li>
                ))}
              </ul>
            </Rise>

            <Rise delay={0.2}>
              <div className="mt-10 flex flex-wrap gap-3">
                {yt?.url && (
                  <a
                    href={yt.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="WATCH"
                    className="group inline-flex items-center gap-3 bg-ivory px-6 py-4 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-obsidian transition-colors hover:bg-gold-hi"
                  >
                    WATCH ON YOUTUBE
                    <span aria-hidden className="transition-transform group-hover:translate-x-1">↗</span>
                  </a>
                )}
                {sp?.url && (
                  <a
                    href={sp.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 border border-gold/45 px-6 py-4 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold hover:text-obsidian"
                  >
                    LISTEN ON SPOTIFY
                    <span aria-hidden className="transition-transform group-hover:translate-x-1">↗</span>
                  </a>
                )}
              </div>
            </Rise>
          </div>
        </div>

        {/* latest episodes */}
        <ul className="mt-20 grid gap-5 md:grid-cols-3">
          {slots.podcastEpisodes.map((ep, i) => (
            <li key={ep.id}>
              <Rise delay={i * 0.07}>
                <article className="group">
                  <MediaTile
                    item={ep}
                    playlist={playlist}
                    index={i + 1}
                    ratio="16:9"
                    cursor="PLAY"
                    sizes="(max-width: 768px) 100vw, 32vw"
                  />
                  <p className="mono mt-5 text-gold">EPISODE</p>
                  <h3 className="mt-2 font-sans text-xl leading-snug text-ivory transition-colors group-hover:text-gold">
                    {ep.title}
                  </h3>
                </article>
              </Rise>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
