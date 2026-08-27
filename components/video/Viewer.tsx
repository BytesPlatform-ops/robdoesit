"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  type MediaItem,
  categoryLabel,
  platformLabel,
  ratioOf,
  statLabel,
  watchOnLabel,
  youtubeEmbed,
} from "@/data/media";
import { Slate } from "./Slate";
import { pauseAllPreviews, resumePreviews } from "@/lib/playback";
import { EASE_CINE } from "@/lib/animations";
import { cn, ratioClass } from "@/lib/utils";

const SOUND_KEY = "rdi:sound";

/* ------------------------------------------------------------------
   The player surface. One of three, decided by what the item actually
   has — never a blank frame, never a broken embed.
   ------------------------------------------------------------------ */
function Player({ item, muted, setMuted }: {
  item: MediaItem;
  muted: boolean;
  setMuted: (v: boolean) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  /* 1 — client-owned file: inline playback with native controls */
  if (item.localVideo) {
    return (
      <>
        <video
          ref={videoRef}
          key={item.localVideo}
          src={item.localVideo}
          poster={item.poster ?? undefined}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          loop
          muted={muted}
          playsInline
          controls
        />
        <button
          type="button"
          onClick={() => setMuted(!muted)}
          className="absolute right-3 top-3 border border-white/25 bg-black/55 px-3 py-2 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-white backdrop-blur transition-colors hover:border-gold hover:text-gold"
        >
          {muted ? "UNMUTE" : "MUTE"}
        </button>
      </>
    );
  }

  /* 2 — YouTube: the official privacy-preserving player, mounted only
         now that the visitor has actually asked to watch */
  if (item.platform === "youtube" && item.youtubeId) {
    return (
      <iframe
        key={item.youtubeId}
        src={youtubeEmbed(item.youtubeId)}
        title={item.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        className="absolute inset-0 h-full w-full border-0"
      />
    );
  }

  /* 3 — Instagram with no licensed file: the real still, and one clear
         way through to the original reel. Never an empty iframe. */
  if (item.poster) {
    return (
      <a
        href={item.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group absolute inset-0 block"
        aria-label={`${watchOnLabel[item.platform]}: ${item.title}`}
      >
        <Image
          src={item.poster}
          alt={item.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 45vw"
          priority
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-obsidian/85 via-transparent to-transparent" />
        <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-3 p-5">
          <span className="flex items-center gap-3 border border-gold/60 bg-obsidian/70 px-6 py-3.5 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-gold backdrop-blur transition-colors duration-300 group-hover:bg-gold group-hover:text-obsidian">
            WATCH REEL
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">↗</span>
          </span>
        </span>
      </a>
    );
  }

  return <Slate id={item.id} label={categoryLabel[item.category]} ratio={ratioOf(item.orientation)} />;
}

export function Viewer({
  items,
  index,
  onClose,
  onNext,
  onPrev,
}: {
  items: MediaItem[];
  index: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const item = items[index];
  const dialog = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  /* remember the sound choice for this browsing session only */
  const [muted, setMuted] = useState(() => {
    try {
      return sessionStorage.getItem(SOUND_KEY) !== "on";
    } catch {
      return true;
    }
  });
  useEffect(() => {
    try {
      sessionStorage.setItem(SOUND_KEY, muted ? "off" : "on");
    } catch {}
  }, [muted]);

  /* modal lifecycle: lock scroll, pause the page, trap focus, restore */
  useEffect(() => {
    const restore = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    pauseAllPreviews();
    closeBtn.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "Tab" && dialog.current) {
        const focusables = dialog.current.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),iframe,video[controls],[tabindex]:not([tabindex="-1"])',
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      resumePreviews();
      restore?.focus?.();
    };
  }, [onClose, onNext, onPrev]);

  const ratio = ratioOf(item.orientation);
  const vertical = ratio === "9:16";

  return (
    <motion.div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      className="fixed inset-0 z-100 flex flex-col bg-obsidian/96 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: EASE_CINE }}
    >
      <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <span className="mono text-gold">
          {String(index + 1).padStart(2, "0")}
          <span className="text-steel-dk"> / {String(items.length).padStart(2, "0")}</span>
        </span>
        <button
          ref={closeBtn}
          type="button"
          onClick={onClose}
          className="flex items-center gap-3 border border-hairline-strong px-4 py-2.5 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ivory/80 transition-colors hover:border-gold/50 hover:text-gold"
        >
          CLOSE <span aria-hidden>✕</span>
        </button>
      </div>

      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE_CINE }}
        className="mx-auto grid w-full max-w-[1500px] flex-1 grid-cols-1 items-center gap-8 overflow-y-auto px-5 pb-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16 lg:overflow-hidden"
        onTouchStart={(e) => {
          (e.currentTarget as HTMLElement).dataset.x = String(e.touches[0].clientX);
        }}
        onTouchEnd={(e) => {
          const start = Number((e.currentTarget as HTMLElement).dataset.x ?? 0);
          const dx = e.changedTouches[0].clientX - start;
          if (Math.abs(dx) > 60) (dx < 0 ? onNext : onPrev)();
        }}
      >
        <div
          className={cn(
            "relative mx-auto w-full overflow-hidden bg-ink",
            ratioClass[ratio],
            vertical ? "max-h-[68vh] max-w-[min(100%,42vh)]" : "max-h-[70vh]",
          )}
        >
          <Player item={item} muted={muted} setMuted={setMuted} />
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="mono text-gold">{platformLabel[item.platform]}</span>
            <span aria-hidden className="h-px w-6 bg-hairline-strong" />
            <span className="mono text-steel">{categoryLabel[item.category]}</span>
          </div>

          <h2 className="display text-[clamp(2rem,4vw,3.25rem)] leading-[0.9]">
            {item.title}
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            <span className="mono border border-gold/30 px-3 py-1.5 text-gold">
              {statLabel(item)}
            </span>
          </div>

          <a
            href={item.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex w-fit items-center gap-3 border border-gold/45 px-6 py-4 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold hover:text-obsidian"
          >
            {watchOnLabel[item.platform]}
            <span aria-hidden className="transition-transform group-hover:translate-x-1">↗</span>
          </a>

          <div className="mt-auto flex gap-3 pt-4">
            <button
              type="button"
              onClick={onPrev}
              className="flex-1 border border-hairline-strong py-4 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ivory/70 transition-colors hover:border-gold/50 hover:text-gold"
            >
              ← PREV
            </button>
            <button
              type="button"
              onClick={onNext}
              className="flex-1 border border-hairline-strong py-4 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ivory/70 transition-colors hover:border-gold/50 hover:text-gold"
            >
              NEXT →
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
