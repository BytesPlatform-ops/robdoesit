"use client";

import { useEffect, useRef } from "react";
import { registerVideo } from "@/lib/playback";

/**
 * A muted, looping preview video that only plays while it is on screen
 * and only while the global playback budget allows it — so a page full
 * of reels never runs a dozen decoders at once.
 */
export function AutoVideo({
  src,
  poster,
  className,
  priority = false,
}: {
  src: string;
  poster?: string | null;
  className?: string;
  priority?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return registerVideo(el, priority);
  }, [priority]);

  return (
    <video
      ref={ref}
      className={className}
      poster={poster ?? undefined}
      muted
      loop
      playsInline
      preload={priority ? "metadata" : "none"}
      // decorative preview — the accessible name lives on the card link
      aria-hidden
      tabIndex={-1}
    >
      <source src={src} />
    </video>
  );
}
