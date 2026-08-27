# ROB DOES IT — CONTENT GUIDE

Every video, thumbnail, price and headline on the site comes from `/data`.
You never have to touch a component to change what visitors see.

---

## THE ONE RULE

**Nothing on this site invents information.**

- View counts are only shown if a real, verified number is typed in.
- Titles are Rob's own captions and published video titles, pulled from
  Instagram and YouTube — not copy someone wrote to fill a box.
- The Spotify link, contact email and phone are `null`, so every button
  and line that would use them stays hidden until real values exist.

---

## 1. THE MEDIA LIBRARY — `data/media.ts`

All 31 pieces of media live in one array. Each entry:

```ts
{
  id: "speak-life-live-event",
  title: "Live at the Speak Life 310 concert with Baby Bash & MC Magic",
  platform: "instagram",          // instagram | youtube | local
  category: "music",              // primary category
  tags: ["event", "interview"],   // extra filter memberships
  externalUrl: "https://www.instagram.com/reel/DWAopG4pOxu/",
  youtubeId: undefined,           // YouTube only
  localVideo: undefined,          // "/videos/xxx.mp4" when you have the file
  poster: "/images/posters/speak-life-live-event.jpg",
  views: null,                    // VERIFIED number only, else null
  featured: true,
  orientation: "vertical",        // vertical | landscape | square
  alt: "Rob interviewing guests at the Speak Life 310 concert",
}
```

### How each item plays

| What it has | Card shows | Clicking it opens |
| --- | --- | --- |
| `localVideo` | muted autoplaying preview | inline player with controls |
| YouTube (`youtubeId`) | official YouTube thumbnail | `youtube-nocookie` player in the modal |
| Instagram (poster only) | the reel's official cover still | the still + **WATCH REEL** through to the original post |

No Instagram or YouTube embed is loaded until a visitor actually opens
something. Cards are plain images.

### The badge on a card

| You set | Card shows |
| --- | --- |
| `views: 331000` | `331K VIEWS` |
| `views: null`, item is in `topViewed` | `TOP VIEWED` |
| `views: null`, `featured: true` | `FEATURED` |
| neither | the category — `INTERVIEW`, `EVENT`, `MUSIC`… |

### Adding a new video

1. Add an entry with `ig(...)` or `yt(...)` at the bottom of `library`.
2. Run `npm run media:posters` — it downloads the official still.
3. That's it. It appears on `/watch` and in its category filter.

To put it on the home rail, add its `id` to `topViewed`.
To feature it on `/watch`, add it to `watchFeatured` (that strip takes five).

---

## 2. WHERE EACH ITEM APPEARS — the `slots` map

The bottom of `data/media.ts` maps media to positions. Change a slot and
that part of the site changes:

| Slot | Where |
| --- | --- |
| `hero` | Home hero background |
| `pillarHost` / `pillarInterview` / `pillarCreate` | Home — HOST / INTERVIEW / CREATE |
| `robEffect` | Home — THE ROB EFFECT |
| `featuredEventWide` + `featuredEventFloats` | Home — ONE NIGHT (plate + 3 floating cuts) |
| `packageSpotlight` / `packageMomentum` / `packageLegacy` | footage behind each pricing card on hover |
| `podcastFeatured` + `podcastEpisodes` | Home — the podcast block |
| `mosaic` | Home — the contact sheet (10 tiles) |
| `homeFinalCta` / `watchFinalCta` / `workFinalCta` / `aboutFinalCta` | closing sections |
| `watchHero` / `workHero` / `aboutHero` | page heroes |
| `aboutStoryStreet` / `aboutStoryGrown` / `aboutIdeaMontage` / `aboutCrowdMover` | About page |
| `audienceMedia` | Work With Rob — footage per audience category |

---

## 3. POSTERS — `npm run media:posters`

```bash
npm run media:posters             # fetch anything missing
npm run media:posters -- --force  # re-download everything
```

It picks the highest real resolution each platform will serve:

| Source | Chain | Result |
| --- | --- | --- |
| YouTube Shorts | `oardefault` → `oar2` → `maxresdefault` → `sddefault` → `hqdefault` | **1080×1920** (the Short's own vertical frame) |
| YouTube video | `maxresdefault` → `sddefault` → `hqdefault` | **1280×720** |
| Instagram reel | the post's own `og:image` | **360×640** |

Files land in `/public/images/posters/<id>.jpg` and are served locally, so
the site never depends on a third-party thumbnail at runtime. The script
measures every file, verifies it against `POSTER_SIZE` in `data/media.ts`,
and lists anything below the 720px quality bar.

`npm run media:titles` prints each item's live caption / video title, so you
can check the titles in `data/media.ts` still match what's published.

### The Instagram resolution ceiling

**Instagram will not serve anything larger than 360×640 for a reel.** Every
other size variant of the same file (`s750x750`, `s1080x1080`, the uncapped
`dst-jpg_e15`) is signature-locked and returns HTTP 403 to anyone who is not
logged in. It also bakes a small play glyph into the dead centre of the frame.

That is fine on a card, and it is why:

- cards render those stills unoptimized (no second lossy re-encode) and are
  never enlarged past what the source carries;
- full-bleed section backgrounds from a 360px still (`fit="ambient"`) are
  framed above centre — which crops the play glyph out — and carry a 2px
  defocus so a ~5× enlargement reads as depth of field rather than a failed
  sharp image. Any source at 720px or wider renders completely unfiltered;
- **no card, thumbnail or grid tile has any blur on it at all.**

Supplying a client-owned still or MP4 for those 19 reels removes all of this
automatically — see §5. That is the single biggest remaining quality win.

---

## 4. THE HERO BACKGROUND

The home hero tries, in order:

1. `/public/videos/rob-hero-showreel.webm`
2. `/public/videos/rob-hero-showreel.mp4`
3. a muted, controls-free YouTube loop of the hero item (desktop only)
4. the hero item's poster still

Whether the showreel files exist is checked on the server at build time, so
the browser never requests a file that isn't there.

**Drop in `rob-hero-showreel.mp4` and it takes over on the next build.**
A 12–20s cut, no audio track, ideally under 6 MB: Hollywood street → interview
→ event crowd → fashion / red carpet → music → Rob on the mic, then loop.

---

## 5. ADDING CLIENT-OWNED MP4s (the biggest single upgrade)

Instagram will not hand over its video files, so those cards are stills today.
Drop the original export in `/public/videos` and set `localVideo`:

```ts
localVideo: "/videos/speak-life-live-event.mp4",
```

That card immediately becomes a muted autoplaying preview and plays inline in
the fullscreen viewer instead of linking out.

**Specs for preview clips:** MP4 / H.264, 6–12s, **no audio track**, 1080×1920
for vertical, under ~2 MB each. The full version stays on Instagram/YouTube —
that is what `externalUrl` is for.

A local file also gives you a proper 1080×1920 poster: pull a clean frame
(faces visible, well exposed, not a transition or a motion-blurred frame) and
save it to `/public/images/posters/`.

### Where previews autoplay today

The home **TOP VIEWED** rail plays muted previews in its most central cards —
three at a time on desktop, one on mobile — and releases them when the rail
scrolls out of view or the tab is backgrounded. Cards with a `localVideo` play
that file; YouTube cards mount a muted `youtube-nocookie` player only while
active. Instagram cards hold their poster, because Instagram serves no file.

Add `localVideo` for the Instagram reels and those cards start playing too,
with no other change.

---

## 6. PACKAGES — `data/packages.ts`

Prices, inclusions, CTA wording, the MOST POPULAR flag, the four
BOOK / SHOWTIME / CREATE / AMPLIFY steps and the WHO THIS IS FOR list.
Used by both the home page and Work With Rob.

## 7. PODCAST — `data/podcasts.ts`

Section copy only. The episodes themselves are in `data/media.ts`
(`slots.podcastFeatured` and `slots.podcastEpisodes`) so they share the same
posters and player as everything else.

## 8. PLATFORMS — `data/socials.ts`

Instagram, YouTube and the website are live. **Spotify is `url: null`**, so
every "Listen on Spotify" button is hidden site-wide. Paste the real URL and
they all appear at once.

## 9. IDENTITY + CONTACT — `data/site.ts`

Still pending, hidden everywhere until set:

- `contact.email` — no email address is shown anywhere yet
- `contact.phone`
- `legalLinks` — Privacy / Terms appear in the footer once those pages exist

---

## 10. WHERE BOOKINGS GO

The form posts to `/api/booking`, which validates and forwards to
`BOOKING_WEBHOOK_URL` (see `.env.example`) — a Zapier or Make hook, Formspree,
a Slack webhook, anything that accepts a JSON POST.

**Until that variable is set, enquiries are logged on the server and not
delivered.** The server log says so on every submission. Set it before launch.

---

## 11. THE LOGO

The working wordmark (mic glyph + `ROB DOES IT.`) is drawn in
`components/layout/Logo.tsx` — full, mark-only, monochrome and the oversized
stacked lockup. If an official logo file exists, drop it in `/public/logos`
and swap it in there; every usage across the site updates.
