"use client";

import { useRef } from "react";
import type { MediaItem } from "@/data/media";
import { ReelCard } from "@/components/video/ReelCard";
import { useViewer } from "@/components/video/ViewerContext";

/**
 * Cinematic featured slider. Vertical and landscape cuts sit side by side
 * on purpose — the rail is native-scrolling (so it stays keyboard and
 * screen-reader friendly) with drag-to-scroll layered on top.
 */
export function FeaturedStrip({ items }: { items: MediaItem[] }) {
  const { open } = useViewer();
  const rail = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, x: 0, left: 0, moved: 0 });

  const down = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !rail.current) return;
    drag.current = { active: true, x: e.clientX, left: rail.current.scrollLeft, moved: 0 };
  };
  const move = (e: React.PointerEvent) => {
    if (!drag.current.active || !rail.current) return;
    const dx = e.clientX - drag.current.x;
    drag.current.moved = Math.max(drag.current.moved, Math.abs(dx));
    rail.current.scrollLeft = drag.current.left - dx;
  };
  const up = () => {
    drag.current.active = false;
  };

  return (
    <div
      ref={rail}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerLeave={up}
      data-cursor="DRAG"
      className="no-bar flex h-[54svh] snap-x snap-mandatory items-stretch gap-4 overflow-x-auto px-5 pb-4 sm:h-[62svh] sm:px-8"
      role="region"
      aria-label="Featured videos"
      tabIndex={0}
    >
      {items.map((item, i) => (
        <div
          key={item.id}
          /* one shared height, width follows the ratio — every card's top and
             bottom line up no matter what shape the footage is */
          className={`h-full shrink-0 snap-start ${
            item.orientation === "landscape"
              ? "aspect-video"
              : item.orientation === "square"
                ? "aspect-square"
                : "aspect-[9/16]"
          }`}
        >
          <ReelCard
            item={item}
            priority={i < 2}
            className="h-full"
            frameClassName="!aspect-auto h-full w-full"
            sizes={
              item.orientation === "landscape"
                ? "(max-width: 640px) 96vw, 62vw"
                : "(max-width: 640px) 54vw, 22vw"
            }
            onOpen={() => {
              if (drag.current.moved > 6) return;
              open(items, i);
            }}
          />
        </div>
      ))}
    </div>
  );
}
