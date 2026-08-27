# ROB DOES IT

The digital home of ROB DOES IT — host, interviewer and professional crowd
mover, Los Angeles / Hollywood.

Two journeys drive the whole site: **WATCH ROB** and **BOOK ROB**.

---

## RUN IT

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

Copy `.env.example` to `.env.local` and set `BOOKING_WEBHOOK_URL` before
going live — see [CONTENT.md](CONTENT.md) §8.

## UPDATE THE CONTENT

Read **[CONTENT.md](CONTENT.md)**. Every video, price, link and headline is in
`/data`; no component edits required.

---

## STACK

Next.js 16 (App Router, Server Components by default) · TypeScript ·
Tailwind CSS v4 · Motion (Framer Motion) · Lenis · React Hook Form + Zod.

No GSAP — the scroll choreography is handled by Motion's `useScroll`, which
kept the bundle smaller.

## STRUCTURE

```
app/                 4 routes + booking API, sitemap, robots
  page.tsx           home
  watch/             the streaming-style library
  work-with-rob/     conversion page + multi-step booking
  about/             the story
components/
  layout/            nav, mobile menu, footer, cursor, loader, transitions
  home/              home page sections
  watch/             featured strip + filterable library
  booking/           audiences, steps, multi-step form
  video/             Frame, Slate, ReelCard, ReelRail, fullscreen Viewer
  ui/                CTA, reveals, label, marquee, camera flash
data/                site · videos · packages · podcasts · socials · media
lib/                 animations · playback budget · utils · validation
public/              video · posters · images · logos
```

---

## HOW THE MEDIA SYSTEM WORKS

All 31 pieces of real ROB DOES IT media live in `data/media.ts` — 19 Instagram
reels and 12 YouTube videos and Shorts. Every official still is downloaded
locally by `npm run media:posters` (YouTube thumbnails and Instagram
`og:image`), so nothing depends on a third-party thumbnail at runtime.

`<Frame item={…} />` is the single media primitive:

1. `localVideo` → budgeted muted autoplay preview
2. `poster` → optimized `next/image`
3. neither → a designed slate (only reachable for a brand-new entry)

…with three fit modes, because Instagram only serves a 360×640 still:
`cover` for cards, `ambient` (blurred, offset, dimmed) for full-bleed
backgrounds, and `letterbox` for a vertical still inside a landscape plate.

**Playback**: cards are plain images — no Instagram or YouTube embed loads
until a visitor opens something. The fullscreen viewer then plays YouTube
through `youtube-nocookie`, a local file inline, or shows the real Instagram
still with a WATCH REEL link to the original post. `lib/playback.ts` runs one
shared IntersectionObserver for the whole site: at most four previews decode
at once, off-screen videos pause, nothing autoplays under reduced motion.

Nothing fake is ever rendered — no stock photography, no invented view counts,
no lorem ipsum. Titles are Rob's own captions and published video titles.

---

## ACCESSIBILITY

- Skip link, semantic landmarks, one `h1` per page
- Full keyboard support: nav, filters, reel rail, multi-step form, and a
  focus-trapped fullscreen viewer with Esc / ← / → and focus restore
- `prefers-reduced-motion` is honoured three ways: CSS freezes the marquees,
  `MotionConfig reducedMotion="user"` drops JS transforms, the reel rail falls
  back to a normal scroll rail and the Rob Effect sequence becomes a static
  list
- Audio never autoplays; the viewer has native controls plus an UNMUTE
  toggle that remembers the choice for the session
- The custom cursor is desktop-and-fine-pointer only and never replaces
  native focus behaviour

## PERFORMANCE

Static prerendering for all four pages, server components everywhere except
genuine interaction, `next/font` for the three families, dynamic import for
the fullscreen viewer, responsive `sizes` on every image, and lazy metadata
video loading. Home page HTML is ~30 KB gzipped.
