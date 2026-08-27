/* ============================================================
   ROB DOES IT — PLATFORMS
   Only verified, live links belong here. A platform with
   `url: null` is hidden everywhere in the UI automatically.
   ============================================================ */

export type Social = {
  id: "instagram" | "youtube" | "spotify" | "tiktok" | "website";
  label: string;
  handle: string | null;
  url: string | null;
  blurb: string;
};

export const socials: Social[] = [
  {
    id: "instagram",
    label: "INSTAGRAM",
    handle: "@itsrobdoesit",
    url: "https://www.instagram.com/itsrobdoesit/",
    blurb: "Reels, red carpets and the moments as they happen.",
  },
  {
    id: "youtube",
    label: "YOUTUBE",
    handle: "@ITSROBDOESIT",
    url: "https://www.youtube.com/@ITSROBDOESIT",
    blurb: "Long-form interviews, event films and full conversations.",
  },
  {
    id: "spotify",
    label: "SPOTIFY",
    handle: null,
    url: null, // SPOTIFY_URL_PENDING — hidden until supplied
    blurb: "The podcast, in your ears.",
  },
  {
    id: "website",
    label: "WEBSITE",
    handle: "itsrobdoesit.com",
    url: "https://itsrobdoesit.com/",
    blurb: "The home base.",
  },
];

export const liveSocials = socials.filter((s) => s.url);
export const social = (id: Social["id"]) => socials.find((s) => s.id === id);
