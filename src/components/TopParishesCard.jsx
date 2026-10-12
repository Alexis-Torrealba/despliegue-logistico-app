import Card from "./Card.jsx";
import { PARISHES, ZONE_COLORS } from "../data/parishes.js";
import { fmt } from "../utils/format.js";

export default function TopParishesCard() {
  const topParishes = [...PARISHES].sort((a, b) => b.tons - a.tons).slice(0, 8);
  const maxTons = Math.max(...PARISHES.map((p) => p.tons));

  return (
    <Card
      id="top"
      className="mb-4.5"
      title="Top parroquias por volumen"
      desc="Las 8 parroquias con mayor cantidad de ayuda recibida"
    >
      <div className="flex flex-col gap-2.5">
        {topParishes.map((p) => (
          <div
            className="grid grid-cols-[160px_1fr_80px] items-center gap-2.5 text-[13px] narrow:grid-cols-[110px_1fr_70px]"
            key={p.name}
          >
            <div className="truncate text-fg-dim">{p.name}</div>
            <div className="h-2.5 overflow-hidden rounded-full bg-bg-alt">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(p.tons / maxTons) * 100}%`,
                  background: ZONE_COLORS[p.zone],
                }}
              ></div>
            </div>
            <div className="text-right font-semibold text-fg tabular-nums">{fmt(p.tons)} t</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
