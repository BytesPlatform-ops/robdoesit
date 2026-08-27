import type { Metadata } from "next";
import { slots } from "@/data/media";
import { PageHero } from "@/components/layout/PageHero";
import { Statement, Story } from "@/components/about/Story";
import { CrowdMover } from "@/components/about/CrowdMover";
import { Platforms } from "@/components/about/Platforms";
import { FinalCta } from "@/components/home/FinalCta";
import { Ticker } from "@/components/home/Ticker";

export const metadata: Metadata = {
  title: { absolute: "About ROB DOES IT" },
  description:
    "Robert Gilbert is ROB DOES IT — a Los Angeles host, interviewer and professional crowd mover who turns live events and street conversations into social-first entertainment.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "SO… WHO IS ROB? — ROB DOES IT",
    description:
      "A mic, a camera and zero interest in boring conversations.",
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        label="ABOUT / ROB DOES IT"
        lines={["SO…", <span key="w">WHO IS ROB<span className="text-gold">?</span></span>]}
        item={slots.aboutHero}
        fit="cover"
      />

      <Ticker />
      <Statement />
      <Story />
      <CrowdMover />
      <Platforms />

      <FinalCta
        lines={["YOU'VE SEEN", "WHAT ROB DOES."]}
        reveal="NOW PUT HIM IN YOUR ROOM."
        secondary={{ label: "WATCH MORE", href: "/watch" }}
        item={slots.aboutFinalCta}
      />
    </>
  );
}
