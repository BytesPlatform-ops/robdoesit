import { customWork } from "@/data/packages";
import { Rise } from "@/components/ui/Reveal";

export function CustomWork() {
  return (
    <section className="relative bg-obsidian pb-24 sm:pb-32">
      <div className="mx-auto max-w-[1800px] px-5 sm:px-8">
        <Rise>
          <div className="edge-metal group relative border border-hairline-strong bg-ink p-8 sm:p-12">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
              <div>
                <h3 className="display text-[clamp(2.25rem,5vw,4rem)] leading-none">
                  {customWork.title}
                </h3>
                <p className="mt-6 max-w-md text-lg leading-relaxed text-ivory/65">
                  {customWork.body}
                </p>
                <a
                  href="#booking"
                  data-cursor="LET'S GO"
                  className="group/cta mt-8 inline-flex items-center gap-3 bg-gold px-7 py-4 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-obsidian transition-colors hover:bg-gold-hi"
                >
                  {customWork.cta}
                  <span aria-hidden className="transition-transform group-hover/cta:translate-x-1">→</span>
                </a>
              </div>

              <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {customWork.items.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-ivory/75">
                    <span aria-hidden className="h-px w-4 shrink-0 bg-gold" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Rise>
      </div>
    </section>
  );
}
