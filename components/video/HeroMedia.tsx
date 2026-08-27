"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { type MediaItem, youtubeAmbient } from "@/data/media";
import type { ShowreelSources } from "@/lib/showreel";
import { useMediaQuery, useReducedMotionPref } from "@/lib/hooks";

/**
 * HERO BACKGROUND — an explicit fallback chain, never an empty gradient:
 *
 *   1. /videos/rob-hero-showreel.webm   (client showreel — best)
 *   2. /videos/rob-hero-showreel.mp4
 *   3. muted, controls-free YouTube ambient loop of the hero item
 *   4. the hero item's poster still
 *
 * Which files exist is resolved on the server, so no request is ever made
 * for a missing showreel. The poster paints underneath from the first
 * frame, so there is no blank moment while anything loads, and under
 * prefers-reduced-motion the chain stops at the poster.
 */
export function HeroMedia({
  item,
  sources,
  className,
}: {
  item: MediaItem;
  sources: ShowreelSources;
  className?: string;
}) {
  const reduced = useReducedMotionPref();
  /* the ambient loop is a desktop nicety — small screens get the crisp
     still instead of an extra third-party player and its bandwidth */
  const wide = useMediaQuery("(min-width: 1024px)");
  const video = useRef<HTMLVideoElement>(null);
  const hasShowreel = Boolean(sources.webm || sources.mp4);

  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (reduced || !hasShowreel) return;
    const el = video.current;
    if (!el) return;

    const ok = () => {
      setPlaying(true);
      el.play().catch(() => setFailed(true));
    };
    const fail = () => setFailed(true);

    el.addEventListener("loadeddata", ok, { once: true });
    el.addEventListener("error", fail, { once: true });
    return () => {
      el.removeEventListener("loadeddata", ok);
      el.removeEventListener("error", fail);
    };
  }, [reduced, hasShowreel]);

  /* stop the background whenever the tab is in the background */
  useEffect(() => {
    const onVis = () => {
      const el = video.current;
      if (!el) return;
      if (document.hidden) el.pause();
      else if (playing) el.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [playing]);

  const useAmbient = !reduced && wide && item.youtubeId && (!hasShowreel || failed);

  return (
    <div className={className} data-media="hero">
      {/* 4 — always painted underneath */}
      {item.poster && (
        <Image
          src={item.poster}
          alt={item.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      )}

      {/* 3 — muted YouTube ambient loop, cropped to cover the viewport */}
      {useAmbient && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <iframe
            src={youtubeAmbient(item.youtubeId!)}
            title=""
            aria-hidden
            tabIndex={-1}
            allow="autoplay; encrypted-media"
            referrerPolicy="strict-origin-when-cross-origin"
            /* over-scaled so the player's own title bar and any paused-state
               chrome sit outside the visible frame */
            className="absolute left-1/2 top-1/2 h-[56.25vw] min-h-[100svh] w-[177.78svh] min-w-full -translate-x-1/2 -translate-y-1/2 scale-[1.35] border-0"
          />
          {/* veil: keeps any residual player chrome from reading as UI */}
          <div className="absolute inset-0 bg-obsidian/25" />
        </div>
      )}

      {/* 1 + 2 — the real showreel, only mounted when the file exists */}
      {!reduced && hasShowreel && !failed && (
        <video
          ref={video}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            playing ? "opacity-100" : "opacity-0"
          }`}
          poster={item.poster ?? undefined}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
          tabIndex={-1}
        >
          {sources.webm && <source src={sources.webm} type="video/webm" />}
          {sources.mp4 && <source src={sources.mp4} type="video/mp4" />}
        </video>
      )}
    </div>
  );
}
