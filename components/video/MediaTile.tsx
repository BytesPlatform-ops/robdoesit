"use client";

import { type MediaItem, categoryLabel } from "@/data/media";
import { Frame, type Fit } from "./Frame";
import { useViewer } from "./ViewerContext";
import { cn } from "@/lib/utils";

/**
 * Any piece of media that should open the global fullscreen viewer.
 * `playlist` is what next/previous walks through from this tile.
 */
export function MediaTile({
  item,
  playlist,
  index = 0,
  ratio,
  fit,
  focus,
  sizes,
  priority,
  className,
  frameClassName,
  imgClassName,
  cursor = "WATCH",
  fill = false,
  children,
}: {
  item: MediaItem;
  playlist?: MediaItem[];
  index?: number;
  ratio?: string;
  fit?: Fit;
  focus?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  /** Shape the media box itself — e.g. cap its height on wide screens. */
  frameClassName?: string;
  imgClassName?: string;
  cursor?: string;
  /** Stretch to the parent's height (grid cells) instead of using the ratio box. */
  fill?: boolean;
  children?: React.ReactNode;
}) {
  const { open } = useViewer();
  const list = playlist ?? [item];

  return (
    <button
      type="button"
      onClick={() => open(list, index)}
      data-cursor={cursor}
      aria-label={`Open: ${item.title}`}
      className={cn("group relative block w-full text-left", fill && "h-full", className)}
    >
      <div className={cn("edge-metal relative overflow-hidden", fill && "h-full")}>
        <Frame
          item={item}
          ratio={ratio}
          fit={fit}
          focus={focus}
          className={cn(fill && "!aspect-auto h-full w-full", frameClassName)}
          sizes={sizes}
          priority={priority}
          label={categoryLabel[item.category]}
          imgClassName={cn(
            "transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]",
            imgClassName,
          )}
        />
        {children}
      </div>
    </button>
  );
}
