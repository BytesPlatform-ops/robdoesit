"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { nav, bookCta, site } from "@/data/site";
import { liveSocials } from "@/data/socials";
import { slots } from "@/data/media";
import { Frame } from "@/components/video/Frame";
import { EASE_CINE } from "@/lib/animations";

export function MobileMenu({
  open,
  onClose,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
}) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    panel.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panel}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-85 bg-obsidian lg:hidden"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.6, ease: EASE_CINE }}
        >
          {/* muted background footage */}
          <div className="pointer-events-none absolute inset-0 opacity-25">
            <Frame
              item={slots.hero}
              ratio="9:16"
              fit="ambient"
              className="h-full w-full"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-obsidian/70 via-obsidian/50 to-obsidian" />
          </div>

          <div className="relative flex h-full flex-col justify-between px-6 pb-8 pt-28">
            <nav aria-label="Primary">
              <ul>
                {nav.map((item, i) => {
                  const active = pathname === item.href;
                  return (
                    <motion.li
                      key={item.href}
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.16 + i * 0.06, duration: 0.6, ease: EASE_CINE }}
                      className="border-b border-hairline"
                    >
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="flex items-baseline gap-4 py-4"
                      >
                        <span className="mono text-gold/70">{item.index}</span>
                        <span
                          className={`display text-[clamp(2.5rem,13vw,4.5rem)] ${
                            active ? "text-gold" : "text-ivory"
                          }`}
                        >
                          {item.label}
                        </span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>

            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.42, duration: 0.6, ease: EASE_CINE }}
              className="space-y-6"
            >
              <Link
                href={bookCta.href}
                onClick={onClose}
                className="flex items-center justify-between border border-gold/50 px-5 py-5"
              >
                <span className="display text-3xl text-gold">{bookCta.label}</span>
                <span aria-hidden className="text-gold">→</span>
              </Link>

              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {liveSocials.map((s) => (
                  <li key={s.id}>
                    <a
                      href={s.url as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mono text-steel transition-colors hover:text-gold"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mono text-steel-dk">{site.locationShort}</p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
