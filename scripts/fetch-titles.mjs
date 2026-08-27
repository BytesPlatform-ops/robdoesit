/* Pulls the real caption / title for every library item so nothing on the
   site is described in words the client did not write.
     node scripts/fetch-titles.mjs   ->  scripts/title-report.json           */
import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const { library } = await import(join(root, "data", "media.ts"));
const UA = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
const dec = (s) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

const out = [];
for (const item of library) {
  try {
    if (item.platform === "youtube") {
      const r = await fetch(
        `https://www.youtube.com/oembed?url=${encodeURIComponent(item.externalUrl)}&format=json`,
      );
      const j = await r.json();
      out.push({ id: item.id, kind: "youtube", real: j.title });
    } else {
      const html = await (await fetch(item.externalUrl, { headers: { "user-agent": UA } })).text();
      const t = html.match(/property="og:title"\s+content="([^"]+)"/)?.[1];
      const caption = t ? dec(t).replace(/^ROB DOES IT on Instagram:\s*"?/, "").replace(/"$/, "") : null;
      const firstLine = caption?.split("\n")[0].trim() ?? null;
      out.push({ id: item.id, kind: "instagram", real: firstLine, full: caption?.slice(0, 300) });
    }
  } catch (e) {
    out.push({ id: item.id, kind: item.platform, error: String(e.message) });
  }
}
await writeFile(join(root, "scripts", "title-report.json"), JSON.stringify(out, null, 2));
out.forEach((o) => console.log(`${o.id.padEnd(34)} ${o.real ?? "ERR " + o.error}`));
