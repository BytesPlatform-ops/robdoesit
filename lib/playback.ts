/* ============================================================
   GLOBAL VIDEO PLAYBACK BUDGET
   One IntersectionObserver for the whole app. At most N preview
   videos decode at the same time; the rest hold their poster.
   Respects prefers-reduced-motion (nothing autoplays).
   ============================================================ */

const MAX_CONCURRENT = 4;

type Entry = { el: HTMLVideoElement; priority: boolean; visible: boolean };

const entries = new Map<HTMLVideoElement, Entry>();
let observer: IntersectionObserver | null = null;
let reduced = false;

function ensureObserver() {
  if (observer || typeof window === "undefined") return;
  reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  observer = new IntersectionObserver(
    (obs) => {
      for (const o of obs) {
        const entry = entries.get(o.target as HTMLVideoElement);
        if (entry) entry.visible = o.isIntersecting && o.intersectionRatio > 0.35;
      }
      reconcile();
    },
    { threshold: [0, 0.35, 0.75], rootMargin: "10% 0px" },
  );
}

function reconcile() {
  if (reduced) {
    entries.forEach((e) => e.el.paused || e.el.pause());
    return;
  }
  const visible = [...entries.values()].filter((e) => e.visible);
  visible.sort((a, b) => Number(b.priority) - Number(a.priority));
  const play = new Set(visible.slice(0, MAX_CONCURRENT).map((e) => e.el));

  entries.forEach(({ el }) => {
    if (play.has(el)) {
      if (el.paused) el.play().catch(() => {});
    } else if (!el.paused) {
      el.pause();
    }
  });
}

export function registerVideo(el: HTMLVideoElement, priority = false) {
  ensureObserver();
  entries.set(el, { el, priority, visible: false });
  observer?.observe(el);
  return () => {
    observer?.unobserve(el);
    entries.delete(el);
  };
}

/** Pause every preview — used while the fullscreen viewer is open. */
export function pauseAllPreviews() {
  entries.forEach(({ el }) => el.pause());
}

export function resumePreviews() {
  reconcile();
}
