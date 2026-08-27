import { Hero } from "@/components/home/Hero";
import { showreelSources } from "@/lib/showreel";
import { Ticker } from "@/components/home/Ticker";
import { WhatRobDoes } from "@/components/home/WhatRobDoes";
import { TopViewed } from "@/components/home/TopViewed";
import { RobEffect } from "@/components/home/RobEffect";
import { FeaturedEvent } from "@/components/home/FeaturedEvent";
import { Services } from "@/components/home/Services";
import { Podcast } from "@/components/home/Podcast";
import { Mosaic } from "@/components/home/Mosaic";
import { FinalCta } from "@/components/home/FinalCta";
import { Flash } from "@/components/ui/Flash";

export default function Home() {
  return (
    <>
      <Hero sources={showreelSources()} />
      <Ticker />
      <WhatRobDoes />
      <TopViewed />
      <RobEffect />
      <FeaturedEvent />
      <Flash />
      <Services />
      <Podcast />
      <Mosaic />
      <FinalCta />
    </>
  );
}
