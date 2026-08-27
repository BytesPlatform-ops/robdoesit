import { liveSocials } from "@/data/socials";
import { Label } from "@/components/ui/Label";
import { Rise } from "@/components/ui/Reveal";

export function Platforms() {
  return (
    <section className="relative bg-ink py-24 sm:py-32" aria-labelledby="platforms">
      <div className="mx-auto max-w-[1800px] px-5 sm:px-8">
        <Label className="mb-8">WHERE ROB LIVES</Label>
        <h2 id="platforms" className="display t-sub mb-16">
          FOLLOW THE NOISE.
        </h2>

        <ul className="border-t border-hairline">
          {liveSocials.map((s, i) => (
            <li key={s.id} className="border-b border-hairline">
              <Rise delay={i * 0.06}>
                <a
                  href={s.url as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="OPEN"
                  className="group flex flex-col gap-3 py-7 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:py-9"
                >
                  <span className="flex flex-wrap items-baseline gap-4">
                    <span className="display text-[clamp(2rem,5.5vw,4.5rem)] leading-none transition-colors duration-300 group-hover:text-gold">
                      {s.label}
                    </span>
                    {s.handle && <span className="mono text-steel">{s.handle}</span>}
                  </span>
                  <span className="flex items-center gap-6">
                    <span className="max-w-xs text-ivory/60">{s.blurb}</span>
                    <span
                      aria-hidden
                      className="text-2xl text-gold transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    >
                      ↗
                    </span>
                  </span>
                </a>
              </Rise>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
