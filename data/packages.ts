/* ============================================================
   ROB DOES IT — BOOKING PACKAGES
   Prices are set by the owner. Edit here, they update on both
   the home page and the Work With Rob page.
   ============================================================ */

export type Pack = {
  id: "spotlight" | "momentum" | "legacy";
  index: string;
  name: string;
  price: number;
  currency: string;
  tagline: string;
  summary: string;
  includes: string[];
  cta: string;
  popular?: boolean;
};

export const packages: Pack[] = [
  {
    id: "spotlight",
    index: "01",
    name: "SPOTLIGHT",
    price: 200,
    currency: "USD",
    tagline: "Generate the buzz.",
    summary:
      "Rob shows up, works the room and leaves you with a week of content the algorithm actually likes.",
    includes: [
      "On-site interviews",
      "Up to 15 professionally edited vertical videos",
      "One week of social-ready content",
      "Instagram Reels optimization",
      "TikTok optimization",
      "YouTube Shorts optimization",
    ],
    cta: "BOOK SPOTLIGHT",
  },
  {
    id: "momentum",
    index: "02",
    name: "MOMENTUM",
    price: 300,
    currency: "USD",
    tagline: "Keep the room moving.",
    summary:
      "Everything in Spotlight, plus a cinematic highlight film and full coverage of the venue, the atmosphere and the people in it.",
    includes: [
      "Everything in Spotlight",
      "Up to 30 edited interview clips",
      "Cinematic event highlight video",
      "Venue coverage",
      "Atmosphere and attendees",
      "Key moments of the night",
    ],
    cta: "BUILD MOMENTUM",
    popular: true,
  },
  {
    id: "legacy",
    index: "03",
    name: "LEGACY",
    price: 500,
    currency: "USD",
    tagline: "Full media partnership.",
    summary:
      "Rob becomes your media partner — the event, the podcast conversation and long-term exposure across the ROB DOES IT platforms.",
    includes: [
      "Complete event media coverage",
      "Featured podcast conversation",
      "Organizer, keynote or brand guest feature",
      "ROB DOES IT YouTube publishing",
      "Spotify publishing",
      "Long-term story and brand exposure",
    ],
    cta: "CREATE A LEGACY",
  },
];

export const customWork = {
  title: "NEED SOMETHING CUSTOM?",
  body: "Some rooms need a different plan. If your event doesn't fit in a box, it probably belongs here.",
  items: [
    "Recurring events",
    "Brand partnerships",
    "Larger activations",
    "Festival coverage",
    "Hosting only",
    "Interview only",
    "Podcast partnerships",
  ],
  cta: "LET'S BUILD IT",
};

export const steps = [
  {
    index: "01",
    title: "BOOK",
    body: "Tell Rob about the event — what it is, who's in the room and what you want people to feel.",
  },
  {
    index: "02",
    title: "SHOWTIME",
    body: "Rob arrives ready to host, interact and interview. The mic comes out and the room opens up.",
  },
  {
    index: "03",
    title: "CREATE",
    body: "The night becomes interviews, vertical clips and cinematic footage while it's still happening.",
  },
  {
    index: "04",
    title: "AMPLIFY",
    body: "You get social-ready content built to keep the event alive online long after the lights go down.",
  },
];

export const audiences = [
  "MUSIC EVENTS",
  "FASHION SHOWS",
  "RED CARPETS",
  "AWARD SHOWS",
  "BRAND ACTIVATIONS",
  "NIGHTLIFE",
  "CREATOR EVENTS",
  "CONFERENCES",
  "PRIVATE EVENTS",
  "FESTIVALS",
];
