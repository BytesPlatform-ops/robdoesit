"use client";

import dynamic from "next/dynamic";
import { AnimatePresence } from "motion/react";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { MediaItem } from "@/data/media";

/* The player is only ever downloaded once a visitor opens something. */
const Viewer = dynamic(() => import("./Viewer").then((m) => m.Viewer), {
  ssr: false,
});

type Ctx = {
  open: (items: MediaItem[], index: number) => void;
  close: () => void;
  next: () => void;
  prev: () => void;
};

const ViewerCtx = createContext<Ctx | null>(null);

export function useViewer() {
  const ctx = useContext(ViewerCtx);
  if (!ctx) throw new Error("useViewer must be used inside <ViewerProvider>");
  return ctx;
}

export function ViewerProvider({ children }: { children: React.ReactNode }) {
  const [playlist, setPlaylist] = useState<MediaItem[] | null>(null);
  const [index, setIndex] = useState(0);

  const open = useCallback((items: MediaItem[], i: number) => {
    setPlaylist(items);
    setIndex(i);
  }, []);
  const close = useCallback(() => setPlaylist(null), []);
  const next = useCallback(
    () => setIndex((i) => (playlist ? (i + 1) % playlist.length : i)),
    [playlist],
  );
  const prev = useCallback(
    () => setIndex((i) => (playlist ? (i - 1 + playlist.length) % playlist.length : i)),
    [playlist],
  );

  const value = useMemo(() => ({ open, close, next, prev }), [open, close, next, prev]);

  return (
    <ViewerCtx.Provider value={value}>
      {children}
      <AnimatePresence>
        {playlist && (
          <Viewer
            key="viewer"
            items={playlist}
            index={index}
            onClose={close}
            onNext={next}
            onPrev={prev}
          />
        )}
      </AnimatePresence>
    </ViewerCtx.Provider>
  );
}
