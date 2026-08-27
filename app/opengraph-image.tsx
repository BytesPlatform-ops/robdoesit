import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/data/site";
import { slots } from "@/data/media";

export const alt =
  "ROB DOES IT — host, interviewer and professional crowd mover, Los Angeles";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  /* real ROB DOES IT frame behind the wordmark */
  let background: string | null = null;
  try {
    const file = join(process.cwd(), "public", slots.hero.poster!.replace(/^\//, ""));
    background = `data:image/jpeg;base64,${(await readFile(file)).toString("base64")}`;
  } catch {
    /* fall through to the flat obsidian plate */
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#050505",
          fontFamily: "sans-serif",
        }}
      >
        {background && (
          <img
            src={background}
            alt=""
            width={1200}
            height={630}
            style={{
              position: "absolute",
              inset: 0,
              width: "1200px",
              height: "630px",
              objectFit: "cover",
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "linear-gradient(90deg, rgba(5,5,5,0.94) 30%, rgba(5,5,5,0.62) 70%, rgba(5,5,5,0.85) 100%)",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "72px 80px",
            width: "100%",
            color: "#F5F1E8",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 24,
              letterSpacing: 8,
              color: "#D4AF37",
              textTransform: "uppercase",
            }}
          >
            {site.location}
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: 156,
                fontWeight: 800,
                lineHeight: 0.86,
                letterSpacing: -4,
              }}
            >
              ROB DOES IT
              <span style={{ color: "#D4AF37" }}>.</span>
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 32,
                height: 2,
                width: 320,
                background: "#D4AF37",
              }}
            />
            <div
              style={{
                display: "flex",
                marginTop: 32,
                fontSize: 28,
                letterSpacing: 6,
                color: "#B9B9B9",
                textTransform: "uppercase",
              }}
            >
              {site.roles.join("  /  ")}
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
