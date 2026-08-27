import type { Metadata } from "next";
import { slots } from "@/data/media";
import { site } from "@/data/site";
import { PageHero } from "@/components/layout/PageHero";
import { Audiences } from "@/components/booking/Audiences";
import { HowItWorks } from "@/components/booking/HowItWorks";
import { CustomWork } from "@/components/booking/CustomWork";
import { BookingSection } from "@/components/booking/BookingSection";
import { Services } from "@/components/home/Services";
import { FinalCta } from "@/components/home/FinalCta";
import { Flash } from "@/components/ui/Flash";

export const metadata: Metadata = {
  title: { absolute: "Work With Rob | Event Hosting & Media Coverage" },
  description:
    "Hire Rob for hosting, interviews, crowd interaction and social-first event coverage in Los Angeles. Packages from $200, plus custom event media partnerships.",
  alternates: { canonical: "/work-with-rob" },
  openGraph: {
    title: "MAKE YOUR EVENT IMPOSSIBLE TO IGNORE — ROB DOES IT",
    description:
      "Hosting, interviews, crowd interaction and social-first event coverage.",
    url: "/work-with-rob",
  },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Event hosting, interviews and social-first event media coverage",
  provider: { "@type": "Person", name: site.person, alternateName: site.name },
  areaServed: { "@type": "City", name: "Los Angeles" },
  url: `${site.url}/work-with-rob`,
};

export default function WorkWithRobPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />

      <PageHero
        label="WORK WITH ROB"
        lines={["MAKE YOUR EVENT", <span key="i">IMPOSSIBLE</span>, <span key="t">TO IGNORE<span className="text-gold">.</span></span>]}
        sub="Hire Rob for hosting, interviews, crowd interaction and social-first event coverage."
        item={slots.workHero}
        titleClassName="display text-[clamp(2.5rem,9vw,9rem)]"
      >
        <a
          href="#booking"
          data-cursor="LET'S GO"
          className="group inline-flex items-center gap-3 bg-gold px-8 py-5 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-obsidian transition-colors hover:bg-gold-hi"
        >
          CHECK AVAILABILITY
          <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
        </a>
      </PageHero>

      <Audiences />
      <HowItWorks />
      <Flash />
      <Services
        detailed
        heading={["PICK YOUR", "LEVEL OF NOISE."]}
        label="SERVICES / PACKAGES"
      />
      <CustomWork />
      <BookingSection />

      <FinalCta
        lines={["THE CROWD'S THERE.", "THE CAMERAS", "ARE READY."]}
        reveal="LET ROB DO IT."
        secondary={{ label: "WATCH ROB", href: "/watch" }}
        item={slots.workFinalCta}
      />
    </>
  );
}
