import { tickerWords, tickerAccents } from "@/data/site";
import { Marquee } from "@/components/ui/Marquee";

export function Ticker() {
  const words = [...tickerWords];

  return (
    <section
      aria-label="What ROB DOES IT covers"
      className="relative z-10 border-y border-hairline bg-obsidian py-5 sm:py-7"
    >
      <Marquee duration={46}>
        {words.map((w, i) => (
          <span key={`${w}-${i}`} className="flex items-center">
            <span
              className={`display px-6 text-[clamp(1.75rem,4.5vw,3.5rem)] leading-none ${
                tickerAccents.has(w) ? "text-gold" : "text-ivory/85"
              }`}
            >
              {w}
            </span>
            <span aria-hidden className="text-gold/60">
              •
            </span>
          </span>
        ))}
      </Marquee>
    </section>
  );
}
