import type { Metadata } from "next";
import { slots, watchFeatured } from "@/data/media";
import { PageHero } from "@/components/layout/PageHero";
import { FeaturedStrip } from "@/components/watch/FeaturedStrip";
import { Library } from "@/components/watch/Library";
import { FinalCta } from "@/components/home/FinalCta";
import { Label } from "@/components/ui/Label";
import { LineReveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: { absolute: "Watch ROB DOES IT | Interviews, Events & Entertainment" },
  description:
    "Interviews, live events, red carpets, street conversations and podcast cuts from ROB DOES IT in Los Angeles. Watch the moments the internet couldn't scroll past.",
  alternates: { canonical: "/watch" },
  openGraph: {
    title: "WATCH ROB DO IT — ROB DOES IT",
    description:
      "Interviews, events, red carpets, podcasts and unpredictable Hollywood moments.",
    url: "/watch",
  },
};

export default function WatchPage() {
  return (
    <>
      <PageHero
        label="ON AIR / ROB DOES IT"
        lines={["WATCH", "ROB", <span key="do">DO IT<span className="text-gold">.</span></span>]}
        sub="Interviews, events, red carpets, podcasts and unpredictable Hollywood moments."
        item={slots.watchHero}
        fit="cover"
      />

      <section className="relative bg-obsidian py-16 sm:py-24" aria-labelledby="featured">
        <div className="mx-auto mb-10 max-w-[1800px] px-5 sm:px-8">
          <Label className="mb-6">TOP VIEWED / FEATURED</Label>
          <LineReveal
            as="h2"
            id="featured"
            lines={["THE ONES THAT TRAVELLED."]}
            className="display text-[clamp(2rem,5vw,4.5rem)]"
          />
        </div>
        <FeaturedStrip items={watchFeatured} />
      </section>

      <Library />

      <FinalCta
        lines={["SEEN ENOUGH?", "PUT ROB IN", "YOUR ROOM."]}
        reveal="THE MIC IS ALREADY PACKED."
        secondary={{ label: "WORK WITH ROB", href: "/work-with-rob" }}
        item={slots.watchFinalCta}
      />
    </>
  );
}
