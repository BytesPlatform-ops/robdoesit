import { slots } from "@/data/media";
import { MediaTile } from "@/components/video/MediaTile";
import { Label } from "@/components/ui/Label";

/* An editorial contact sheet — deliberately irregular, never a 3x3 grid. */
const spans = [
  "col-span-2 row-span-2",
  "col-span-2 row-span-2 sm:row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-2",
  "col-span-2 row-span-2 sm:row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-2",
  "col-span-1 row-span-1",
  "col-span-2 row-span-2",
  "col-span-2 row-span-2 sm:row-span-1",
];

export function Mosaic() {
  const tiles = slots.mosaic;

  return (
    <section className="relative bg-obsidian py-24 sm:py-32" aria-labelledby="mosaic">
      <div className="mx-auto max-w-[1800px] px-5 sm:px-8">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Label className="mb-6">THE CONTACT SHEET</Label>
            <h2 id="mosaic" className="display t-sub">
              ROOMS, FACES<br />AND EVERYTHING BETWEEN.
            </h2>
          </div>
          <p className="mono max-w-xs text-steel">
            LOS ANGELES / HOLLYWOOD — SHOT ON THE FLOOR, NOT FROM THE BACK OF THE ROOM
          </p>
        </div>

        <ul className="grid auto-rows-[30vw] grid-cols-2 gap-3 sm:auto-rows-[15vw] sm:grid-cols-4 lg:auto-rows-[9.5vw] lg:grid-cols-6">
          {tiles.map((item, i) => (
            <li key={item.id} className={`${spans[i % spans.length]} group relative`}>
              <MediaTile
                item={item}
                playlist={tiles}
                index={i}
                ratio="16:9"
                fit="cover"
                focus="50% 24%"
                fill
                imgClassName="brightness-[0.88] transition-[transform,filter] duration-700 group-hover:scale-[1.06] group-hover:brightness-100"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 17vw"
              >
                <div className="pointer-events-none absolute inset-0 z-10 flex items-end bg-gradient-to-t from-obsidian/85 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <span className="mono translate-y-2 text-gold transition-transform duration-500 group-hover:translate-y-0">
                    {item.title}
                  </span>
                </div>
              </MediaTile>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
