import Link from "next/link";
import { Label } from "@/components/ui/Label";

export default function NotFound() {
  return (
    <section className="flex min-h-[86svh] items-center bg-obsidian">
      <div className="mx-auto w-full max-w-[1800px] px-5 py-32 sm:px-8">
        <Label className="mb-8">404 / OFF CAMERA</Label>
        <h1 className="display t-section">
          THAT MOMENT
          <br />
          ISN&apos;T HERE.
        </h1>
        <p className="mt-8 max-w-md text-lg leading-relaxed text-ivory/65">
          The page moved, or it never made the cut. Plenty else to watch.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/watch"
            data-cursor="WATCH"
            className="group inline-flex items-center gap-3 bg-ivory px-7 py-4 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-obsidian transition-colors hover:bg-gold-hi"
          >
            WATCH ROB
            <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center border border-hairline-strong px-7 py-4 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-ivory/80 transition-colors hover:border-ivory/40"
          >
            BACK HOME
          </Link>
        </div>
      </div>
    </section>
  );
}
