import { seed } from "@/lib/utils";

/**
 * Designed film slate used wherever a real ROB DOES IT asset has not
 * been supplied yet. It shows only true information (the content
 * category and format) — never dummy copy, never a fake image.
 * Drop a file into the matching data slot and it disappears.
 */
export function Slate({
  id,
  label,
  ratio = "16:9",
}: {
  id: string;
  label: string;
  ratio?: string;
}) {
  const s = seed(id);
  const angle = 90 + Math.round(s * 180);
  const x = 20 + Math.round(s * 60);
  const y = 25 + Math.round((1 - s) * 50);
  const index = String(Math.round(s * 98) + 1).padStart(2, "0");

  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden bg-obsidian"
      style={{
        backgroundImage: `radial-gradient(80% 60% at ${x}% ${y}%, rgba(212,175,55,0.10), transparent 60%),
          radial-gradient(60% 80% at ${100 - x}% ${100 - y}%, rgba(245,241,232,0.055), transparent 65%),
          linear-gradient(${angle}deg, #0b0b0b 0%, #050505 55%, #0e0e0e 100%)`,
      }}
    >
      {/* sheen */}
      <div
        className="absolute -inset-x-1/4 top-0 h-full opacity-[0.14]"
        style={{
          background:
            "linear-gradient(104deg, transparent 38%, rgba(243,214,117,0.55) 50%, transparent 62%)",
          transform: `translateX(${(s - 0.5) * 30}%)`,
        }}
      />

      {/* ghost index */}
      <span
        className="display outline-type absolute select-none leading-none"
        style={{
          fontSize: "clamp(6rem, 26vw, 18rem)",
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-48%)",
          opacity: 0.13,
        }}
      >
        {index}
      </span>

      {/* crop marks */}
      <span className="absolute left-3 top-3 h-4 w-4 border-l border-t border-gold/45" />
      <span className="absolute right-3 top-3 h-4 w-4 border-r border-t border-gold/45" />
      <span className="absolute bottom-3 left-3 h-4 w-4 border-b border-l border-gold/45" />
      <span className="absolute bottom-3 right-3 h-4 w-4 border-b border-r border-gold/45" />

      {/* caption */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
        <span className="mono text-ivory/70">{label}</span>
        <span className="mono text-steel/70">{ratio}</span>
      </div>
      <div className="rule-gold absolute inset-x-4 bottom-11 opacity-50" />
    </div>
  );
}
