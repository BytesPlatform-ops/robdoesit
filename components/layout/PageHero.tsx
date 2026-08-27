import type { MediaItem } from "@/data/media";
import { Frame } from "@/components/video/Frame";
import { Label } from "@/components/ui/Label";
import { LineReveal, Rise } from "@/components/ui/Reveal";

/** Shared page opener: full-bleed media plate, oversized stacked title. */
export function PageHero({
  label,
  lines,
  sub,
  item,
  fit = "ambient",
  children,
  align = "end",
  titleClassName = "display t-hero",
}: {
  label: string;
  lines: React.ReactNode[];
  sub?: string;
  item: MediaItem;
  children?: React.ReactNode;
  align?: "end" | "center";
  fit?: "cover" | "ambient";
  /** Long titles need a tighter scale — pass one in. */
  titleClassName?: string;
}) {
  return (
    <section className="relative isolate flex min-h-[86svh] flex-col justify-end overflow-hidden bg-obsidian">
      <div className="absolute inset-0 -z-10">
        <Frame item={item} ratio="16:9" fit={fit} className="!aspect-auto h-full w-full" priority sizes="100vw" />
        <div className="absolute inset-0 bg-obsidian/74" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/45 to-obsidian/80" />
      </div>

      <div
        className={`mx-auto w-full max-w-[1800px] px-5 pb-16 pt-36 sm:px-8 sm:pb-20 ${
          align === "center" ? "text-center" : ""
        }`}
      >
        <Label className="mb-8">{label}</Label>

        <LineReveal as="h1" animate lines={lines} className={titleClassName} />

        {sub && (
          <Rise delay={0.25}>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-ivory/70">{sub}</p>
          </Rise>
        )}

        {children && (
          <Rise delay={0.35}>
            <div className="mt-10">{children}</div>
          </Rise>
        )}
      </div>
    </section>
  );
}
