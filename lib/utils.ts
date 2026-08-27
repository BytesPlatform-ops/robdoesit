export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/** Deterministic 0..1 from a string — used for slate variation. */
export function seed(id: string) {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 1000) / 1000;
}

export const ratioClass: Record<string, string> = {
  "9:16": "aspect-[9/16]",
  "16:9": "aspect-[16/9]",
  "1:1": "aspect-square",
  "4:5": "aspect-[4/5]",
  "3:4": "aspect-[3/4]",
};
