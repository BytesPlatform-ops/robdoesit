import Link from "next/link";
import { topViewed } from "@/data/media";
import { ReelRail } from "@/components/video/ReelRail";
import { Label } from "@/components/ui/Label";
import { LineReveal } from "@/components/ui/Reveal";

export function TopViewed() {
  return (
    <section
      className="relative overflow-hidden bg-obsidian py-20 sm:py-28"
      aria-labelledby="top-viewed"
    >
      <div className="mx-auto mb-12 max-w-[1800px] px-5 sm:mb-16 sm:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Label className="mb-8">TOP VIEWED / ROB DOES IT</Label>
            <LineReveal
              as="h2"
              id="top-viewed"
              lines={["THE INTERNET", "COULDN'T SCROLL PAST."]}
              className="display t-section"
            />
          </div>

          <Link
            href="/watch"
            data-cursor="WATCH"
            className="group inline-flex w-fit shrink-0 items-center gap-3 border-b border-gold/40 pb-2 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-gold transition-colors hover:border-gold"
          >
            SEE EVERYTHING
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>

      <ReelRail items={topViewed} />

      <p className="mx-auto mt-10 max-w-[1800px] px-5 sm:px-8">
        <span className="mono text-steel-dk">DRAG · SWIPE · TAP TO WATCH</span>
      </p>
    </section>
  );
}
