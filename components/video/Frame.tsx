import Image from "next/image";
import { AutoVideo } from "./AutoVideo";
import { Slate } from "./Slate";
import {
  type MediaItem,
  categoryLabel,
  isLowRes,
  posterSize,
  ratioOf,
} from "@/data/media";
import { cn, ratioClass } from "@/lib/utils";

/** Feature media is re-encoded at 90, not Next's default 75. */
export const MEDIA_QUALITY = 90;

/**
 * The single media primitive for the whole site.
 *
 *   localVideo -> budgeted muted autoplay preview
 *   poster     -> optimized next/image at quality 90
 *   neither    -> designed slate (only reachable for a brand-new item)
 *
 * FIT MODES
 *   cover     — the default. Crisp, fills the frame, no filters.
 *   ambient   — full-bleed section background. Framed above centre so the
 *               platform's own play glyph (baked into the centre of every
 *               Instagram reel still) falls outside the crop.
 *   letterbox — a vertical still inside a landscape plate: crisp and
 *               contained, over a blurred backdrop of itself.
 *
 * RESOLUTION
 * Instagram only serves a 360x640 still, so a full-bleed background from one
 * is a ~5x enlargement. Those get a slight defocus so they read as depth of
 * field rather than as a failed sharp image; every source at or above
 * SHARP_MIN_WIDTH renders completely unfiltered. Supply a client still or
 * MP4 and the defocus disappears on its own.
 */
export type Fit = "cover" | "ambient" | "letterbox";

export function Frame({
  item,
  ratio,
  fit = "cover",
  /** object-position for the crisp layer. */
  focus,
  className,
  imgClassName,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
  eager = false,
  quality = MEDIA_QUALITY,
  label,
  children,
}: {
  item: MediaItem;
  ratio?: string;
  fit?: Fit;
  focus?: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
  /** Load immediately even when off-screen — for marquee clones, which sit
      outside the viewport horizontally and would otherwise pop in blank. */
  eager?: boolean;
  quality?: number;
  label?: string;
  children?: React.ReactNode;
}) {
  const r = ratio ?? ratioOf(item.orientation);
  const source = posterSize(item);
  /* A 360x640 Instagram still is already smaller than any box we render it
     in, so the optimizer can only re-encode it — a second lossy pass for no
     saving. Serve those byte-for-byte and let the browser scale. */
  const raw = isLowRes(item);
  const box = cn(
    "relative isolate overflow-hidden bg-ink grain",
    ratioClass[r] ?? "aspect-video",
    className,
  );

  /* client-owned footage wins over every still */
  if (item.localVideo) {
    return (
      <div className={box} data-media="video" data-source="local">
        <AutoVideo
          src={item.localVideo}
          poster={item.poster}
          priority={priority}
          className={cn("absolute inset-0 h-full w-full object-cover", imgClassName)}
        />
        {children}
      </div>
    );
  }

  if (!item.poster) {
    return (
      <div className={box} data-media="pending">
        <Slate id={item.id} label={label ?? categoryLabel[item.category]} ratio={r} />
        <span className="sr-only">{item.alt}</span>
        {children}
      </div>
    );
  }

  const dims = source ? `${source.width}x${source.height}` : undefined;

  if (fit === "ambient") {
    const softenLowRes = isLowRes(item);
    return (
      <div className={box} data-media="still" data-fit="ambient" data-source-size={dims}>
        <Image
          src={item.poster}
          alt={item.alt}
          fill
          sizes={sizes}
          priority={priority}
          loading={eager && !priority ? "eager" : undefined}
          quality={quality}
          unoptimized={raw}
          className={cn(
            "scale-[1.18] object-cover",
            softenLowRes && "blur-[2px]",
            imgClassName,
          )}
          style={{ objectPosition: focus ?? "50% 26%" }}
        />
        {children}
      </div>
    );
  }

  if (fit === "letterbox") {
    return (
      <div className={box} data-media="still" data-fit="letterbox" data-source-size={dims}>
        {/* decorative wash so a 9:16 still can sit in a 16:9 plate */}
        <Image
          src={item.poster}
          alt=""
          aria-hidden
          fill
          sizes="50vw"
          quality={75}
          className="scale-125 object-cover blur-2xl brightness-[0.3] saturate-[0.75]"
        />
        <Image
          src={item.poster}
          alt={item.alt}
          fill
          sizes={sizes}
          priority={priority}
          loading={eager && !priority ? "eager" : undefined}
          quality={quality}
          unoptimized={raw}
          className={cn("object-contain", imgClassName)}
        />
        {children}
      </div>
    );
  }

  return (
    <div className={box} data-media="still" data-fit="cover" data-source-size={dims}>
      <Image
        src={item.poster}
        alt={item.alt}
        fill
        sizes={sizes}
        priority={priority}
        loading={eager && !priority ? "eager" : undefined}
        quality={quality}
        unoptimized={raw}
        className={cn("object-cover", imgClassName)}
        style={focus ? { objectPosition: focus } : undefined}
      />
      {children}
    </div>
  );
}
