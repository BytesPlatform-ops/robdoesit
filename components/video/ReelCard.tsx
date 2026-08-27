"use client";

import { type MediaItem, categoryLabel, platformLabel, statLabel } from "@/data/media";
import { Frame } from "./Frame";
import { InlinePreview } from "./InlinePreview";
import { cn } from "@/lib/utils";

export function ReelCard({
  item,
  onOpen,
  className,
  frameClassName,
  ratio,
  priority,
  eager = false,
  duplicate = false,
  preview = false,
  sizes = "(max-width: 640px) 70vw, (max-width: 1280px) 30vw, 24vw",
}: {
  item: MediaItem;
  onOpen: () => void;
  className?: string;
  /** Override the frame box — used where a row shares one fixed height. */
  frameClassName?: string;
  ratio?: string;
  priority?: boolean;
  eager?: boolean;
  /** A looping copy in the rail: still clickable, but announced once only. */
  duplicate?: boolean;
  /** This card is in the active playback set — run its muted preview. */
  preview?: boolean;
  sizes?: string;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      data-cursor="WATCH"
      aria-label={`Open: ${item.title}`}
      aria-hidden={duplicate || undefined}
      tabIndex={duplicate ? -1 : undefined}
      className={cn(
        "group relative block w-full overflow-hidden text-left focus-visible:outline-offset-4",
        className,
      )}
    >
      <div className={cn("edge-metal relative overflow-hidden", frameClassName && "h-full")}>
        <Frame
          item={item}
          ratio={ratio}
          className={frameClassName}
          sizes={sizes}
          priority={priority}
          eager={eager}
          label={categoryLabel[item.category]}
          imgClassName="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
        />

        <InlinePreview item={item} active={preview} />

        {/* metadata — an elegant gradient, never a full cover */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-obsidian via-obsidian/55 to-transparent px-4 pb-4 pt-14">
          <div className="mb-2 flex items-center gap-2.5">
            <span className="mono text-gold">{platformLabel[item.platform]}</span>
            <span aria-hidden className="h-px w-4 bg-gold/40" />
            <span className="mono text-ivory/65">{statLabel(item)}</span>
          </div>
          <p className="line-clamp-2 font-sans text-[0.9rem] leading-snug text-ivory">
            {item.title}
          </p>
        </div>
      </div>
    </button>
  );
}
