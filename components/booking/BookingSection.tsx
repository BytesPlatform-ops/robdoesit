"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/Label";
import { LineReveal } from "@/components/ui/Reveal";

/* The form pulls in form state + validation. It sits well below the fold,
   so it is only fetched once the visitor is heading towards it. */
const BookingForm = dynamic(
  () => import("./BookingForm").then((m) => m.BookingForm),
  { ssr: false, loading: () => <FormFrame /> },
);

/** Matches the real form's chrome so nothing jumps when it mounts. */
function FormFrame() {
  return (
    <div className="border border-hairline-strong bg-ink" aria-hidden>
      <div className="flex items-center justify-between gap-6 border-b border-hairline px-6 py-5 sm:px-10">
        <span className="mono text-gold">
          STEP 01<span className="text-steel-dk"> / 05</span>
        </span>
        <div className="h-px flex-1 bg-hairline-strong">
          <div className="h-px w-1/5 bg-gold/50" />
        </div>
      </div>
      <div className="min-h-[430px] px-6 py-10 sm:px-10 sm:py-14">
        <p className="display text-[clamp(1.75rem,4vw,3rem)] leading-none text-ivory/25">
          WHAT&apos;S HAPPENING?
        </p>
      </div>
    </div>
  );
}

export function BookingSection() {
  const anchor = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = anchor.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setReady(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="booking" className="relative scroll-mt-28 bg-obsidian py-24 sm:py-32">
      <div className="mx-auto max-w-[1800px] px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.25fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Label className="mb-8">BOOKING</Label>
            <LineReveal
              as="h2"
              lines={["CHECK", "AVAILABILITY."]}
              className="display t-section"
            />
            <p className="mt-8 max-w-sm text-lg leading-relaxed text-ivory/65">
              Five quick steps. No forms that feel like paperwork — just what
              Rob needs to know to show up ready.
            </p>
          </div>

          <div ref={anchor}>{ready ? <BookingForm /> : <FormFrame />}</div>
        </div>
      </div>
    </section>
  );
}
