/* ============================================================
   ROB DOES IT — SITE CONFIG
   Single source of truth for identity, contact + navigation.

   PENDING VALUES: anything set to `null` is intentionally not
   rendered anywhere in the UI until a real value is supplied.
   Never replace these with placeholder/dummy data.
   ============================================================ */

export const site = {
  name: "ROB DOES IT",
  person: "Robert Gilbert",
  url: "https://itsrobdoesit.com",
  locale: "en_US",

  location: "Los Angeles / Hollywood",
  locationShort: "LA / HOLLYWOOD",

  role: "Host / Interviewer / Professional Crowd Mover",
  roles: ["HOST", "INTERVIEWER", "PROFESSIONAL CROWD MOVER"],

  positioning:
    "An entertainment-first media brand built around a host, interviewer and professional crowd mover who turns live events, personalities and spontaneous conversations into social-first entertainment.",

  commercial:
    "Event organizers, brands, artists and venues bring Rob in to energize the room, interview the people and turn the experience into content audiences actually want to watch.",

  /* CONTACT — set these when real values are confirmed.
     `null` = hidden in UI. Do not fill with dummy data. */
  contact: {
    email: null as string | null, // CONTACT_EMAIL_PENDING
    phone: null as string | null, // CONTACT_PHONE_PENDING
    bookingFallbackUrl: "/work-with-rob#booking",
  },

  legal: {
    entity: "ROB DOES IT",
    since: 2021,
  },

  /* Legal pages render in the footer only once they exist.
     Add e.g. { label: "PRIVACY", href: "/privacy" } when written. */
  legalLinks: [] as { label: string; href: string }[],
} as const;

export type NavItem = {
  label: string;
  href: string;
  index: string;
  cta?: boolean;
};

export const nav: NavItem[] = [
  { label: "HOME", href: "/", index: "01" },
  { label: "WATCH", href: "/watch", index: "02" },
  { label: "WORK WITH ROB", href: "/work-with-rob", index: "03" },
  { label: "ABOUT", href: "/about", index: "04" },
];

export const bookCta = {
  label: "BOOK ROB",
  href: "/work-with-rob#booking",
} as const;

export const tickerWords = [
  "HOLLYWOOD",
  "RED CARPET",
  "LIVE EVENTS",
  "INTERVIEWS",
  "PODCAST",
  "FASHION",
  "MUSIC",
  "SOCIAL CONTENT",
  "PROFESSIONAL CROWD MOVER",
] as const;

/* Words rendered in gold inside the ticker */
export const tickerAccents = new Set([
  "HOLLYWOOD",
  "PROFESSIONAL CROWD MOVER",
]);
