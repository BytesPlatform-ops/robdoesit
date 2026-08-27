import Link from "next/link";
import { type MediaItem, slots } from "@/data/media";
import { liveSocials } from "@/data/socials";
import { bookCta } from "@/data/site";
import { Frame } from "@/components/video/Frame";
import { LineReveal, Rise } from "@/components/ui/Reveal";

export function FinalCta({
  lines = ["YOUR EVENT", "DESERVES MORE", "THAN COVERAGE."],
  reveal = "LET'S MAKE IT A MOMENT.",
  secondary = { label: "WATCH MORE", href: "/watch" },
  item = slots.homeFinalCta,
}: {
  lines?: string[];
  reveal?: string;
  secondary?: { label: string; href: string } | null;
  item?: MediaItem;
}) {
  return (
    <section className="relative isolate flex min-h-[92svh] items-center overflow-hidden bg-obsidian">
      <div className="absolute inset-0 -z-10">
        <Frame
          item={item}
          ratio="16:9"
          fit="ambient"
          className="!aspect-auto h-full w-full"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-obsidian/76" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-obsidian/80" />
      </div>

      <div className="mx-auto w-full max-w-[1800px] px-5 py-24 sm:px-8">
        <LineReveal lines={lines} as="h2" className="display t-section" />

        <Rise delay={0.2}>
          <p className="foil display mt-6 text-[clamp(1.75rem,4.5vw,3.5rem)] leading-none">
            {reveal}
          </p>
        </Rise>

        <Rise delay={0.3}>
          <div className="mt-12 flex flex-wrap gap-3">
            <Link
              href={bookCta.href}
              data-cursor="LET'S GO"
              className="group inline-flex items-center gap-3 bg-gold px-8 py-5 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-obsidian transition-colors duration-300 hover:bg-gold-hi"
            >
              {bookCta.label}
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
            {secondary && (
              <Link
                href={secondary.href}
                data-cursor="WATCH"
                className="inline-flex items-center border border-hairline-strong px-8 py-5 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-ivory/85 transition-colors duration-300 hover:border-ivory/50 hover:text-ivory"
              >
                {secondary.label}
              </Link>
            )}
          </div>
        </Rise>

        <Rise delay={0.4}>
          <ul className="mt-14 flex flex-wrap gap-x-8 gap-y-3">
            {liveSocials.map((s) => (
              <li key={s.id}>
                <a
                  href={s.url as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mono text-steel transition-colors hover:text-gold"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </Rise>
      </div>
    </section>
  );
}
