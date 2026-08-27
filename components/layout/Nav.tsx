"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useScrolled } from "@/lib/hooks";
import { motion } from "motion/react";
import { nav, bookCta } from "@/data/site";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { cn } from "@/lib/utils";

export function Nav() {
  const pathname = usePathname();
  const scrolled = useScrolled(40);
  /* the menu belongs to the route it was opened on, so any navigation
     (including the back button) closes it without an effect */
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;
  const setOpen = (next: boolean) => setOpenAt(next ? pathname : null);

  return (
    <>
      <a
        href="#main"
        className="sr-only-focusable fixed left-4 top-4 z-100 bg-gold px-4 py-2 font-mono text-xs uppercase tracking-widest text-obsidian"
      >
        Skip to content
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-90 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          scrolled
            ? "border-b border-gold/15 bg-obsidian/72 py-3 backdrop-blur-xl"
            : "border-b border-transparent py-6",
        )}
      >
        <div className="mx-auto flex max-w-[1800px] items-center justify-between gap-6 px-5 sm:px-8">
          <Link
            href="/"
            aria-label="ROB DOES IT — home"
            data-cursor="HOME"
            className="shrink-0"
          >
            <Logo compact={scrolled} />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {nav.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group relative block py-1 font-mono text-[0.7rem] uppercase tracking-[0.2em] transition-colors duration-300",
                        active ? "text-gold" : "text-ivory/70 hover:text-ivory",
                      )}
                    >
                      {item.label}
                      <span
                        aria-hidden
                        className={cn(
                          "absolute -bottom-0.5 left-0 h-px bg-gold transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]",
                          active ? "w-full" : "w-0 group-hover:w-full",
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href={bookCta.href}
              data-cursor="LET'S GO"
              className="group relative hidden overflow-hidden border border-gold/45 px-6 py-3 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-gold transition-colors duration-300 hover:text-obsidian sm:inline-flex"
            >
              <span
                aria-hidden
                className="absolute inset-0 origin-left scale-x-0 bg-gold transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
              />
              <span className="relative z-10 flex items-center gap-2">
                {bookCta.label}
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative flex h-11 w-11 items-center justify-center border border-hairline-strong lg:hidden"
            >
              <span className="flex w-5 flex-col gap-[5px]">
                <motion.span
                  animate={open ? { rotate: 45, y: 3.5 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="block h-px w-full bg-ivory"
                />
                <motion.span
                  animate={open ? { rotate: -45, y: -3.5 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="block h-px w-full bg-ivory"
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={open} onClose={() => setOpen(false)} pathname={pathname} />
    </>
  );
}
