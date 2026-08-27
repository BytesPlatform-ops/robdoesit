import { steps } from "@/data/packages";
import { Label } from "@/components/ui/Label";
import { LineReveal, Rise } from "@/components/ui/Reveal";

export function HowItWorks() {
  return (
    <section className="relative bg-ink py-24 sm:py-32" aria-labelledby="how">
      <div className="mx-auto max-w-[1800px] px-5 sm:px-8">
        <Label className="mb-8">HOW IT WORKS</Label>
        <LineReveal
          as="h2"
          id="how"
          lines={["FOUR STEPS.", "ONE UNFORGETTABLE NIGHT."]}
          className="display t-section"
        />

        <ol className="mt-16 border-t border-hairline">
          {steps.map((s, i) => (
            <li key={s.index} className="border-b border-hairline">
              <Rise delay={i * 0.06}>
                <div className="group grid items-baseline gap-4 py-8 sm:py-12 md:grid-cols-[auto_1fr_1.2fr] md:gap-10">
                  <span
                    className="display outline-type leading-[0.8] transition-colors duration-500 group-hover:text-gold"
                    style={{ fontSize: "clamp(3.5rem,9vw,8rem)" }}
                    aria-hidden
                  >
                    {s.index}
                  </span>
                  <h3 className="display text-[clamp(2rem,4vw,3.25rem)] leading-none">
                    {s.title}
                  </h3>
                  <p className="max-w-lg text-lg leading-relaxed text-ivory/65">
                    {s.body}
                  </p>
                </div>
              </Rise>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
