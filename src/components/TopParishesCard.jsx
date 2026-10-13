import Card from "./Card.jsx";
import { PARISHES, ZONE_COLORS } from "../data/parishes.js";
import { fmt } from "../utils/format.js";

const TOP_COUNT = 8;

export default function TopParishesCard() {
  const topParishes = [...PARISHES].sort((a, b) => b.tons - a.tons).slice(0, TOP_COUNT);
  const maxTons = Math.max(...PARISHES.map((p) => p.tons));

  return (
    <Card
      id="top"
      className="mb-4.5"
      title="Top parroquias por volumen"
      desc={`Las ${topParishes.length} parroquias con mayor cantidad de ayuda recibida`}
    >
      {/* Leyenda propia: el color de cada barra es su zona */}
      <ul
        className="-mt-1.5 mb-4 flex list-none flex-wrap gap-x-4 gap-y-1 p-0 text-[12.5px] text-fg-dim"
        aria-label="Color de cada zona"
      >
        {Object.entries(ZONE_COLORS).map(([zone, color]) => (
          <li key={zone} className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-[2px]" style={{ background: color }}></span>
            {zone}
          </li>
        ))}
      </ul>
      {/* En pantallas estrechas el nombre no cabe al lado de la barra sin cortarse:
          pasa arriba, completo, con las toneladas a la derecha y la barra debajo */}
      <div className="bar-list flex flex-col gap-2.5 narrow:gap-3.5">
        {topParishes.map((p, i) => (
          <div
            className="grid grid-cols-[190px_1fr_80px] items-center gap-2.5 text-[13px] narrow:grid-cols-[1fr_auto] narrow:gap-x-3 narrow:gap-y-1.5"
            key={p.name}
            style={{ "--i": i }}
          >
            <div
              className="truncate text-fg-dim narrow:col-start-1 narrow:row-start-1 narrow:whitespace-normal narrow:text-fg"
              title={p.name}
            >
              {p.name}
              <span className="sr-only">, zona {p.zone}</span>
            </div>
            <div
              className="h-2.5 overflow-hidden rounded-[2px] bg-bg-alt narrow:col-span-2 narrow:row-start-2 narrow:h-2"
              aria-hidden="true"
            >
              <div
                className="bar-fill h-full rounded-[2px]"
                style={{
                  width: `${(p.tons / maxTons) * 100}%`,
                  background: ZONE_COLORS[p.zone],
                }}
              ></div>
            </div>
            <div className="text-right font-semibold text-fg tabular-nums narrow:col-start-2 narrow:row-start-1">
              {fmt(p.tons)} t
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
