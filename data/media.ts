/* ============================================================
   ROB DOES IT — CENTRAL MEDIA LIBRARY
   ------------------------------------------------------------
   Every video, thumbnail and background on the site resolves
   from this one file. Nothing is hardcoded inside components.

   HOW EACH ITEM RESOLVES AT RUNTIME
   1. localVideo  -> muted looping preview + inline modal playback
   2. poster      -> real still (YouTube thumbnail / Instagram
                     og:image, both downloaded to /public/images/posters)
   3. platform    -> how the fullscreen viewer plays it:
                     youtube   = youtube-nocookie embed
                     instagram = poster + open the original reel
                     local     = inline <video>

   ADDING CLIENT MP4s (recommended, see CONTENT.md)
   Drop the file in /public/videos and set `localVideo`. The card
   upgrades from a still to an autoplaying muted preview and the
   modal plays it inline — no other change needed.

   VIEW COUNTS: `views` may only hold a number read off the real
   platform. Leave it null and the badge falls back to TOP VIEWED /
   FEATURED / the category name. Never estimate.
   ============================================================ */

export type Platform = "instagram" | "youtube" | "local";

export type Category =
  | "interview"
  | "event"
  | "music"
  | "fashion"
  | "red-carpet"
  | "street"
  | "podcast"
  | "personality";

export type Orientation = "vertical" | "landscape" | "square";

export type MediaItem = {
  id: string;
  title: string;
  platform: Platform;
  /** Primary category — drives the badge and the default filter. */
  category: Category;
  /** Extra filter memberships (a red-carpet interview is both). */
  tags?: Category[];
  externalUrl: string;
  youtubeId?: string;
  /** Client-owned MP4/WebM in /public/videos. Enables autoplay previews. */
  localVideo?: string;
  poster?: string;
  /** Verified platform count only, else null. */
  views?: number | null;
  featured?: boolean;
  autoplayPreview?: boolean;
  orientation?: Orientation;
  alt: string;
};

const posterPath = (id: string) => `/images/posters/${id}.jpg`;

/**
 * Real pixel size of each poster source. `npm run media:posters` measures
 * the downloaded files and fails loudly if these drift, so components can
 * size images to what the source actually supports instead of upscaling it.
 *
 *   Instagram        360 x 640   (public ceiling — every larger transform
 *                                 of the same file is signature-locked)
 *   YouTube Shorts  1080 x 1920  (the Short's own `oardefault` frame)
 *   YouTube video   1280 x 720   (`maxresdefault`)
 */
export const POSTER_SIZE = {
  instagram: { width: 360, height: 640 },
  youtubeVertical: { width: 1080, height: 1920 },
  youtubeLandscape: { width: 1280, height: 720 },
} as const;

export function posterSize(item: MediaItem) {
  if (item.platform === "instagram") return POSTER_SIZE.instagram;
  if (item.platform === "youtube")
    return item.orientation === "vertical"
      ? POSTER_SIZE.youtubeVertical
      : POSTER_SIZE.youtubeLandscape;
  return null;
}

/** Below this a source cannot fill a large frame sharply. */
export const SHARP_MIN_WIDTH = 720;

/** True when the still is too small to carry a full-bleed frame. */
export const isLowRes = (item: MediaItem) => {
  const s = posterSize(item);
  return !s || s.width < SHARP_MIN_WIDTH;
};

/** Instagram reel. Poster is the post's official og:image, stored locally. */
const ig = (
  id: string,
  shortcode: string,
  title: string,
  category: Category,
  alt: string,
  extra: Partial<MediaItem> = {},
): MediaItem => ({
  id,
  title,
  platform: "instagram",
  category,
  externalUrl: `https://www.instagram.com/reel/${shortcode}/`,
  poster: posterPath(id),
  views: null,
  orientation: "vertical",
  autoplayPreview: false,
  alt,
  ...extra,
});

/** YouTube video or Short. Poster is the official thumbnail, stored locally. */
const yt = (
  id: string,
  youtubeId: string,
  title: string,
  category: Category,
  alt: string,
  extra: Partial<MediaItem> = {},
): MediaItem => ({
  id,
  title,
  platform: "youtube",
  category,
  externalUrl: extra.orientation === "vertical"
    ? `https://www.youtube.com/shorts/${youtubeId}`
    : `https://www.youtube.com/watch?v=${youtubeId}`,
  youtubeId,
  poster: posterPath(id),
  views: null,
  orientation: "landscape",
  autoplayPreview: false,
  alt,
  ...extra,
});

/* ============================================================
   THE LIBRARY
   ============================================================ */

export const library: MediaItem[] = [
  /* ---------- Instagram ----------
     Titles are the client's own captions, lightly tidied. Nothing here
     is invented copy. ---------------------------------------------- */
  ig("speak-life-live-event", "DWAopG4pOxu",
    "Live at the Speak Life 310 concert with Baby Bash & MC Magic", "music",
    "Rob interviewing guests at the Speak Life 310 concert",
    { tags: ["event", "interview"], featured: true }),

  ig("event-production-coverage", "DcAFXUVB5Qj",
    "The best productions, time after time", "event",
    "Rob hosting with the microphone at a full production event",
    { tags: ["personality"], featured: true }),

  ig("supermodel-interview", "Dbwa05nBJUh",
    "Supermodel Management, y'all", "interview",
    "Rob interviewing models from Supermodel Management",
    { tags: ["fashion", "red-carpet"], featured: true }),

  ig("dream-night-event", "DXYLrYbBjz1",
    "What a dream that night was", "event",
    "Wide footage from a full event night",
    { tags: ["red-carpet"], featured: true }),

  ig("professional-crowd-mover", "DXawdXnJHCU",
    "Doing the Rob at Velvet Rodeo Content Festival", "personality",
    "Rob on stage doing the Rob and moving the crowd at Velvet Rodeo Content Festival",
    { tags: ["event", "street"], featured: true }),

  ig("rob-does-it-lounge", "DXdHfuvgzuM",
    "Everybody to the ROB DOES IT lounge", "event",
    "Guests in the ROB DOES IT lounge at an event",
    { tags: ["interview"] }),

  ig("rob-does-it-stage", "DXX99HEhC-u",
    "A whole vibe at the ROB DOES IT stage", "event",
    "Crowd and performers at the ROB DOES IT stage",
    { tags: ["music"], featured: true }),

  ig("phoenix-girls-performance", "DXXUwfph2Ls",
    "What a performance by The Phoenix Girls", "music",
    "The Phoenix Girls performing live on stage",
    { tags: ["event"] }),

  ig("interview-clip", "DXLF7uzBGVe",
    "Diana Shaforostova looked amazing", "interview",
    "Rob interviewing Diana Shaforostova at an event",
    { tags: ["fashion"] }),

  ig("fashion-natty-zach", "DcMUKTZJE5H",
    "The beautiful Natty Zach, everybody", "fashion",
    "Rob interviewing Natty Zach at a poolside event"),

  ig("catwalk-fashion-show", "DcMvkaMpt41",
    "Am I ready to catwalk a fashion show?", "fashion",
    "Rob walking a fashion show runway",
    { tags: ["event"] }),

  ig("supermodel-outfit", "Db67yWkh0Zm",
    "That outfit was fire", "fashion",
    "Fashion moment captured at an event"),

  ig("oktoberfest-interview", "Db6ShOUhfpW",
    "Have y'all been to Oktoberfest?", "interview",
    "Rob interviewing guests at an Oktoberfest event",
    { tags: ["event"] }),

  ig("madeline-monet-stage", "DXfDIdzJv0F",
    "Madeline Monet taking the stage", "music",
    "Madeline Monet performing on stage"),

  ig("speaklife-madeline-monet", "DXfeleKpxIT",
    "Madeline Monet and Speak Life 310 at the ROB DOES IT stage", "music",
    "Madeline Monet and Speak Life 310 performing at the ROB DOES IT stage",
    { tags: ["event"] }),

  ig("speak-life-performance", "DXfsTw9pD3o",
    "Speak Life 310 performing at the ROB DOES IT stage", "music",
    "Speak Life 310 performing in front of a full crowd at the ROB DOES IT stage",
    { tags: ["event"], featured: true }),

  ig("supporters-interview", "DXIu3iAplhL",
    "My biggest supporters", "interview",
    "Rob talking with supporters at an event",
    { tags: ["personality"] }),

  ig("personality-brownies", "Db4eXGqRbYE",
    "I still wonder how those brownies came out", "personality",
    "Rob in a candid, off-the-cuff moment"),

  ig("red-carpet-fashion", "DcKKypSp5iq",
    "I'm not a no sabo kid", "red-carpet",
    "Rob on the red carpet during an event",
    { tags: ["fashion"] }),

  /* ---------- YouTube — titles as published ---------- */
  yt("supermodel-relationship-interview", "ohGROQhvtHo",
    "A supermodel gives us her take on relationships", "interview",
    "Rob interviewing a model on camera about relationships",
    { featured: true }),

  yt("warren-g-short", "75OxrrIHCyc",
    "The hype for Warren G is real", "music",
    "Fans reacting to Warren G at a live show",
    { orientation: "vertical", featured: true }),

  yt("warren-g-short-two", "ujFo1PG9Cc0",
    "Warren G in the house", "music",
    "Warren G at a live event",
    { orientation: "vertical", featured: true }),

  yt("hollywood-experience-tourists", "CKvXc0rm4gM",
    "Giving tourists the Hollywood experience", "street",
    "Rob on Hollywood Boulevard giving tourists the Hollywood experience",
    { tags: ["personality"], featured: true }),

  yt("michael-sartain-podcast", "DLD03gR0yCE",
    "EP. 02 — Why men are struggling more than ever in dating, with Michael Sartain",
    "podcast",
    "Rob and Michael Sartain recording the ROB DOES IT podcast",
    { featured: true }),

  yt("speak-life-podcast", "LBBo8VgnOpU",
    "EP. 03 — Meeting SpeakLife310", "podcast",
    "Rob recording the ROB DOES IT podcast with SpeakLife310"),

  yt("anabelle-cianciullo-podcast", "MjGldqXOBS0",
    "EP. 04 — From Chicago stages to Hollywood sets, with Anabelle Cianciullo",
    "podcast",
    "Rob recording the ROB DOES IT podcast with Anabelle Cianciullo"),

  yt("numa-palmer-podcast", "SqfH4X2VGgo",
    "EP. 05 — Creating a life through music, with Numa Palmer", "podcast",
    "Rob recording the ROB DOES IT podcast with Numa Palmer"),

  yt("warren-g-music", "kXB71lsnTkw",
    "The man, the legend: Warren G", "music",
    "Rob with Warren G", { orientation: "vertical" }),

  yt("speak-life-short", "ytALw_UUib0",
    "Nobody opens like Speak Life 310", "music",
    "Speak Life 310 opening a live show",
    { orientation: "vertical", tags: ["event"] }),

  yt("annina-unger-short", "E7zqfu4pF3o",
    "Annina Unger said it", "personality",
    "Rob interviewing Annina Unger",
    { orientation: "vertical", tags: ["interview"] }),

  yt("tequila-24k-short", "KP8EFOqEojQ",
    "Shout out to 24K Tequila", "personality",
    "Rob at a 24K Tequila brand activation",
    { orientation: "vertical", tags: ["event"] }),
];

/* ============================================================
   LOOKUP + SELECTORS
   ============================================================ */

const index = new Map(library.map((m) => [m.id, m]));

export function byId(id: string): MediaItem {
  const item = index.get(id);
  if (!item) throw new Error(`Unknown media id: ${id}`);
  return item;
}

/** Ordered pick — the way every section composes its media. */
export const pick = (...ids: string[]): MediaItem[] => ids.map(byId);

export const inCategory = (c: Category) =>
  library.filter((m) => m.category === c || m.tags?.includes(c));

/* ============================================================
   WATCH PAGE FILTERS
   Each filter can span more than one category.
   ============================================================ */

export type FilterId =
  | "all"
  | "top"
  | "interviews"
  | "red-carpet"
  | "events"
  | "street"
  | "music"
  | "fashion"
  | "podcast";

export const filters: { id: FilterId; label: string; categories?: Category[] }[] = [
  { id: "all", label: "ALL" },
  { id: "top", label: "TOP VIEWED" },
  { id: "interviews", label: "INTERVIEWS", categories: ["interview"] },
  { id: "red-carpet", label: "RED CARPET", categories: ["red-carpet"] },
  { id: "events", label: "EVENTS", categories: ["event"] },
  { id: "street", label: "STREET", categories: ["street", "personality"] },
  { id: "music", label: "MUSIC", categories: ["music"] },
  { id: "fashion", label: "FASHION", categories: ["fashion"] },
  { id: "podcast", label: "PODCAST", categories: ["podcast"] },
];

/* ============================================================
   RANKED / FEATURED SETS
   Ordered by the owner, not by guessed metrics.
   ============================================================ */

/** Home — "THE INTERNET COULDN'T SCROLL PAST" rail. */
export const topViewed = pick(
  "speak-life-live-event",
  "supermodel-relationship-interview",
  "warren-g-short",
  "warren-g-short-two",
  "professional-crowd-mover",
  "dream-night-event",
  "supermodel-interview",
  "hollywood-experience-tourists",
  "michael-sartain-podcast",
  "speak-life-performance",
);

const topIds = new Set(topViewed.map((m) => m.id));

/** Watch — the five premium feature cards. */
export const watchFeatured = pick(
  "speak-life-live-event",
  "supermodel-relationship-interview",
  "michael-sartain-podcast",
  "warren-g-short",
  "hollywood-experience-tourists",
);

export function filterMedia(id: FilterId): MediaItem[] {
  if (id === "all") return library;
  if (id === "top") return topViewed;
  const f = filters.find((x) => x.id === id);
  if (!f?.categories) return library;
  return library.filter(
    (m) =>
      f.categories!.includes(m.category) ||
      m.tags?.some((t) => f.categories!.includes(t)),
  );
}

/* ============================================================
   NAMED SLOTS — which item fills which part of which page
   ============================================================ */

export const slots = {
  /* HOME */
  hero: byId("hollywood-experience-tourists"),
  pillarHost: byId("event-production-coverage"),
  pillarInterview: byId("supermodel-interview"),
  pillarCreate: byId("speak-life-live-event"),
  robEffect: byId("professional-crowd-mover"),
  featuredEventWide: byId("dream-night-event"),
  featuredEventFloats: pick(
    "rob-does-it-lounge",
    "rob-does-it-stage",
    "phoenix-girls-performance",
  ),
  homeFinalCta: byId("speak-life-performance"),

  /* PACKAGES (home + work with rob) */
  packageSpotlight: byId("interview-clip"),
  packageMomentum: byId("event-production-coverage"),
  packageLegacy: byId("michael-sartain-podcast"),

  /* PODCAST */
  podcastFeatured: byId("michael-sartain-podcast"),
  podcastEpisodes: pick(
    "speak-life-podcast",
    "anabelle-cianciullo-podcast",
    "numa-palmer-podcast",
  ),

  /* SOCIAL MOSAIC */
  mosaic: pick(
    "fashion-natty-zach",
    "catwalk-fashion-show",
    "supermodel-outfit",
    "oktoberfest-interview",
    "madeline-monet-stage",
    "speaklife-madeline-monet",
    "phoenix-girls-performance",
    "interview-clip",
    "supermodel-interview",
    "red-carpet-fashion",
  ),

  /* WATCH */
  watchHero: byId("hollywood-experience-tourists"),
  watchFinalCta: byId("rob-does-it-stage"),

  /* WORK WITH ROB */
  workHero: byId("dream-night-event"),
  workFinalCta: byId("event-production-coverage"),

  /* ABOUT */
  aboutHero: byId("hollywood-experience-tourists"),
  aboutStoryStreet: byId("hollywood-experience-tourists"),
  aboutStoryGrown: byId("event-production-coverage"),
  aboutIdeaMontage: pick(
    "supermodel-interview",
    "dream-night-event",
    "catwalk-fashion-show",
    "hollywood-experience-tourists",
  ),
  aboutCrowdMover: byId("professional-crowd-mover"),
  aboutCrowdSupport: byId("catwalk-fashion-show"),
  aboutFinalCta: byId("speak-life-live-event"),
} as const;

/** WORK WITH ROB — footage behind each audience category. */
export const audienceMedia: Record<string, MediaItem> = {
  "MUSIC EVENTS": byId("speak-life-performance"),
  "FASHION SHOWS": byId("catwalk-fashion-show"),
  "RED CARPETS": byId("red-carpet-fashion"),
  "AWARD SHOWS": byId("supermodel-interview"),
  "BRAND ACTIVATIONS": byId("tequila-24k-short"),
  NIGHTLIFE: byId("rob-does-it-stage"),
  "CREATOR EVENTS": byId("rob-does-it-lounge"),
  CONFERENCES: byId("oktoberfest-interview"),
  "PRIVATE EVENTS": byId("dream-night-event"),
  FESTIVALS: byId("phoenix-girls-performance"),
};

/* ============================================================
   DISPLAY HELPERS
   ============================================================ */

export const categoryLabel: Record<Category, string> = {
  interview: "INTERVIEW",
  event: "EVENT",
  music: "MUSIC",
  fashion: "FASHION",
  "red-carpet": "RED CARPET",
  street: "STREET",
  podcast: "PODCAST",
  personality: "PERSONALITY",
};

export const platformLabel: Record<Platform, string> = {
  instagram: "INSTAGRAM",
  youtube: "YOUTUBE",
  local: "ROB DOES IT",
};

export const watchOnLabel: Record<Platform, string> = {
  instagram: "WATCH ON INSTAGRAM",
  youtube: "WATCH ON YOUTUBE",
  local: "WATCH THE FULL CLIP",
};

export const ratioOf = (o: Orientation = "vertical") =>
  o === "landscape" ? "16:9" : o === "square" ? "1:1" : "9:16";

export function formatViews(n: number): string {
  if (n >= 1_000_000)
    return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}

/**
 * Card badge. Never fabricates a number: a verified count wins, then
 * TOP VIEWED for the ranked rail, then FEATURED, then the category.
 */
export function statLabel(item: MediaItem): string {
  if (typeof item.views === "number") return `${formatViews(item.views)} VIEWS`;
  if (topIds.has(item.id)) return "TOP VIEWED";
  if (item.featured) return "FEATURED";
  return categoryLabel[item.category];
}

/** YouTube thumbnail source, used by the poster download script. */
export type YoutubeThumbQuality =
  | "oardefault"
  | "oar2"
  | "maxresdefault"
  | "sddefault"
  | "hqdefault";

export const youtubeThumb = (id: string, q: YoutubeThumbQuality = "maxresdefault") =>
  `https://i.ytimg.com/vi/${id}/${q}.jpg`;

export const youtubeEmbed = (id: string) =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0&modestbranding=1`;

/** Muted, controls-free background loop for hero fallback. */
export const youtubeAmbient = (id: string) =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}` +
  `&controls=0&disablekb=1&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3`;
