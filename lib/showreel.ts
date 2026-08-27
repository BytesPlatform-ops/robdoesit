import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Which hero showreel files actually exist in /public/videos.
 * Resolved on the server at build time so the browser never fires a
 * request for a file that isn't there — no 404s in the console, and the
 * hero drops straight to its next fallback instead.
 *
 * Drop rob-hero-showreel.mp4 (and optionally .webm) into /public/videos
 * and the hero starts using it on the next build. See CONTENT.md.
 */
const NAME = "rob-hero-showreel";

export type ShowreelSources = { webm: string | null; mp4: string | null };

export function showreelSources(): ShowreelSources {
  const dir = join(process.cwd(), "public", "videos");
  return {
    webm: existsSync(join(dir, `${NAME}.webm`)) ? `/videos/${NAME}.webm` : null,
    mp4: existsSync(join(dir, `${NAME}.mp4`)) ? `/videos/${NAME}.mp4` : null,
  };
}
