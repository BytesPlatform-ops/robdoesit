"use client";

import { useCallback, useSyncExternalStore } from "react";

const noop = () => () => {};

/**
 * SSR-safe media query. Uses useSyncExternalStore so the correct value is
 * available on the first client render — no flash of the wrong layout.
 */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (typeof window === "undefined") return noop();
      const m = window.matchMedia(query);
      m.addEventListener("change", onChange);
      return () => m.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export const useReducedMotionPref = () =>
  useMediaQuery("(prefers-reduced-motion: reduce)");

/**
 * Has the page scrolled past a threshold — in pixels, or as a fraction of
 * the viewport height ("vh").
 */
export function useScrolled(threshold: number, unit: "px" | "vh" = "px") {
  const subscribe = useCallback((onChange: () => void) => {
    if (typeof window === "undefined") return noop();
    window.addEventListener("scroll", onChange, { passive: true });
    window.addEventListener("resize", onChange);
    return () => {
      window.removeEventListener("scroll", onChange);
      window.removeEventListener("resize", onChange);
    };
  }, []);

  return useSyncExternalStore(
    subscribe,
    () =>
      window.scrollY >
      (unit === "vh" ? window.innerHeight * threshold : threshold),
    () => false,
  );
}
