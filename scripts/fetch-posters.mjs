/* ============================================================
   POSTER FETCHER
   Downloads the official still for every item in the media
   library into /public/images/posters so the site never depends
   on a remote thumbnail at runtime.

     npm run media:posters          # only missing posters
     npm run media:posters -- --force   # re-download everything

   YouTube (vertical/Shorts) -> oardefault (native 1080x1920), then oar2,
                                then the letterboxed maxresdefault
   YouTube (landscape)       -> maxresdefault (1280x720), then sddefault, hqdefault
   Instagram                 -> the post's own og:image (360x640 — Instagram's
                                public ceiling; every larger transform of the
                                same file is signature-locked and returns 403)
   ============================================================ */

import { mkdir, writeFile, readFile, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "images", "posters");
const force = process.argv.includes("--force");

const { library, youtubeThumb } = await import(join(root, "data", "media.ts"));

const CRAWLER_UA =
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

const decode = (s) =>
  s
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#039;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");

async function download(url, headers = {}) {
  const res = await fetch(url, { headers, redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 4096) throw new Error(`too small (${buf.length}b)`);
  return buf;
}

/* Highest real resolution first. `oardefault` is the Short's own
   1080x1920 frame — vastly better in a 9:16 card than cropping the
   pillarboxed 1280x720 thumbnail. It 404s for landscape uploads. */
const YT_CHAIN = {
  vertical: ["oardefault", "oar2", "maxresdefault", "sddefault", "hqdefault"],
  landscape: ["maxresdefault", "sddefault", "hqdefault"],
  square: ["maxresdefault", "sddefault", "hqdefault"],
};

async function youtubePoster(item) {
  const chain = YT_CHAIN[item.orientation ?? "landscape"] ?? YT_CHAIN.landscape;
  for (const q of chain) {
    try {
      const buf = await download(youtubeThumb(item.youtubeId, q));
      return { buf, source: `youtube:${q}` };
    } catch {
      /* try the next quality down */
    }
  }
  throw new Error("no youtube thumbnail available");
}

async function instagramPoster(item) {
  const res = await fetch(item.externalUrl, {
    headers: { "user-agent": CRAWLER_UA, "accept-language": "en-US,en;q=0.9" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`reel page HTTP ${res.status}`);
  const html = await res.text();

  const image = html.match(/property="og:image"\s+content="([^"]+)"/)?.[1];
  const title = html.match(/property="og:title"\s+content="([^"]+)"/)?.[1];
  if (!image) throw new Error("no og:image on the reel page");

  const buf = await download(decode(image), { "user-agent": CRAWLER_UA });
  return { buf, source: "instagram:og:image", remoteTitle: title && decode(title) };
}

const exists = (p) => stat(p).then(() => true, () => false);

/* Minimal JPEG dimension reader — walks the segment markers to the SOF.
   Keeps this script dependency-free and platform-independent. */
function jpegSize(buf) {
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) { i++; continue; }
    const marker = buf[i + 1];
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    }
    i += 2 + buf.readUInt16BE(i + 2);
  }
  return null;
}

await mkdir(outDir, { recursive: true });

const report = [];
const queue = [...library];
const CONCURRENCY = 4;

async function worker() {
  while (queue.length) {
    const item = queue.shift();
    if (!item?.poster) continue;
    const file = join(root, "public", item.poster.replace(/^\//, ""));

    if (!force && (await exists(file))) {
      const buf = await readFile(file);
      const size = jpegSize(buf);
      report.push({
        id: item.id,
        status: "cached",
        width: size?.width ?? null,
        height: size?.height ?? null,
      });
      continue;
    }

    try {
      const { buf, source, remoteTitle } =
        item.platform === "youtube"
          ? await youtubePoster(item)
          : await instagramPoster(item);
      await writeFile(file, buf);
      const size = jpegSize(buf);
      report.push({
        id: item.id,
        status: "ok",
        source,
        bytes: buf.length,
        width: size?.width ?? null,
        height: size?.height ?? null,
        remoteTitle,
      });
      console.log(
        `  ✓ ${item.id.padEnd(34)} ${source.padEnd(22)} ` +
          `${size ? `${size.width}x${size.height}` : "?"} ${(buf.length / 1024).toFixed(0)}KB`,
      );
    } catch (error) {
      report.push({ id: item.id, status: "failed", error: String(error.message) });
      console.log(`  ✗ ${item.id.padEnd(34)} ${error.message}`);
    }
  }
}

console.log(`Fetching posters for ${library.length} media items…\n`);
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

const failed = report.filter((r) => r.status === "failed");
console.log(
  `\nDone. ok=${report.filter((r) => r.status === "ok").length} ` +
    `cached=${report.filter((r) => r.status === "cached").length} ` +
    `failed=${failed.length}`,
);
if (failed.length) {
  console.log("\nFAILED — these need a client-supplied still:");
  failed.forEach((f) => console.log(`  ${f.id}: ${f.error}`));
}
await writeFile(join(root, "scripts", "poster-report.json"), JSON.stringify(report, null, 2));

/* Measured dimensions are written back into the app so components can size
   images to what the source actually supports instead of upscaling it. */
const sizes = Object.fromEntries(
  report.filter((r) => r.width).map((r) => [r.id, [r.width, r.height]]),
);
/* Verify the sizes declared in data/media.ts against the real files, so a
   changed upstream thumbnail can never silently leave the app thinking a
   source is higher resolution than it is. */
const { posterSize } = await import(join(root, "data", "media.ts"));
const drift = [];
for (const item of library) {
  const declared = posterSize(item);
  const actual = sizes[item.id];
  if (!declared || !actual) continue;
  if (declared.width !== actual[0] || declared.height !== actual[1]) {
    drift.push(`${item.id}: declared ${declared.width}x${declared.height}, actual ${actual[0]}x${actual[1]}`);
  }
}
console.log(
  drift.length
    ? `\n⚠ POSTER_SIZE drift in data/media.ts:\n  ${drift.join("\n  ")}`
    : "\n✓ declared POSTER_SIZE matches every file on disk",
);

const low = report.filter((r) => r.width && r.width < 720);
if (low.length) {
  console.log(`\n${low.length} poster(s) below the 720px quality bar — these need a client-supplied still:`);
  low.forEach((r) => console.log(`  ${r.id.padEnd(34)} ${r.width}x${r.height}`));
}
