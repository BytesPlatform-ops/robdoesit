"use client";

import { useEffect, useRef, useState } from "react";
import { type MediaItem, youtubeAmbient } from "@/data/media";

/**
 * The muted preview that plays inside a card once it becomes active.
 * It always sits on top of the card's poster, so there is never a blank
 * frame — the poster shows until real footage is actually running.
 *
 *   localVideo -> <video>, played programmatically (the autoplay attribute
 *                 alone is unreliable), with the play() promise handled so a
 *                 blocked autoplay can never surface as an unhandled rejection
 *   youtubeId  -> a muted, controls-free youtube-nocookie player, mounted
 *                 ONLY while the card is active and unmounted when it leaves
 *   neither    -> nothing; the poster stands (Instagram will not serve a
 *                 file, so those cards need a client-owned MP4)
 */
export function InlinePreview({
  item,
  active,
}: {
  item: MediaItem;
  active: boolean;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [embedReady, setEmbedReady] = useState(false);

  /* Reset both fade flags the moment the card's active state flips, during
     render rather than in an effect, so the poster is never left showing a
     stopped frame for a beat. (React's "adjusting state on prop change".) */
  const [wasActive, setWasActive] = useState(active);
  if (wasActive !== active) {
    setWasActive(active);
    setPlaying(false);
    setEmbedReady(false);
  }

  /* local file: drive play/pause explicitly — the autoplay attribute alone
     is not dependable across browsers */
  useEffect(() => {
    const el = video.current;
    if (!el) return;

    if (!active) {
      el.pause();
      return;
    }

    el.muted = true; // belt and braces — a sound-on autoplay would be blocked
    let cancelled = false;
    el.play().then(
      () => {
        if (!cancelled) setPlaying(true);
      },
      () => {
        /* autoplay refused (data saver, battery saver): keep the poster */
      },
    );
    return () => {
      cancelled = true;
    };
  }, [active]);

  /* the embed needs a beat to paint its first frame; fade it in after that
     so the poster never flashes to black underneath it */
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setEmbedReady(true), 900);
    return () => clearTimeout(t);
  }, [active]);

  /* stop everything when the tab goes to the background */
  useEffect(() => {
    const onVis = () => {
      const el = video.current;
      if (!el) return;
      if (document.hidden) el.pause();
      else if (active) el.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [active]);

  if (item.localVideo) {
    return (
      <video
        ref={video}
        src={item.localVideo}
        poster={item.poster ?? undefined}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
        tabIndex={-1}
        className={`pointer-events-none absolute inset-0 z-[1] h-full w-full object-cover transition-opacity duration-500 ${
          playing ? "opacity-100" : "opacity-0"
        }`}
      />
    );
  }

  if (item.youtubeId && active) {
    const vertical = item.orientation === "vertical";
    return (
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 z-[1] overflow-hidden transition-opacity duration-700 ${
          embedReady ? "opacity-100" : "opacity-0"
        }`}
      >
        <iframe
          src={youtubeAmbient(item.youtubeId)}
          title=""
          tabIndex={-1}
          allow="autoplay; encrypted-media"
          referrerPolicy="strict-origin-when-cross-origin"
          /* a 16:9 player cropped to cover a 9:16 card, matching how the
             poster is cropped, so the switch from still to motion is seamless */
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-0 ${
            vertical ? "h-full w-full" : "h-full w-[320%]"
          }`}
        />
      </div>
    );
  }

  return null;
}
