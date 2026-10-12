import Card from "./Card.jsx";
import Doughnut from "./Doughnut.jsx";
import { Legend, LegendItem } from "./Legend.jsx";
import { FLEET_SOURCES, TOTAL_TONS, TOTAL_VEHICLES, ZONES } from "../data/parishes.js";
import TruckIcon from "./TruckIcon.jsx";
import { fmt } from "../utils/format.js";

export default function ZoneDistributionCard() {
  const sorted = [...ZONES].sort((a, b) => b.tons - a.tons);

  return (
    <Card
      id="por-zona"
      title="Distribución por zona"
      desc="Toneladas de ayuda entregadas, por zona geográfica"
    >
      <div className="flex flex-wrap items-center gap-[22px]">
        <Doughnut
          labels={ZONES.map((z) => z.name)}
          data={ZONES.map((z) => z.tons)}
          colors={ZONES.map((z) => z.color)}
          centerLabel="Toneladas"
          centerValue={fmt(TOTAL_TONS)}
        />
        <Legend>
          {sorted.map((z) => (
            <LegendItem
              key={z.name}
              color={z.color}
              value={
                <>
                  {fmt(z.tons)} t · {((z.tons / TOTAL_TONS) * 100).toFixed(1)}%
                </>
              }
            >
              {z.name}
            </LegendItem>
          ))}
        </Legend>
      </div>
      <div className="mt-2.5 flex justify-between gap-2.5 border-t border-dashed border-line pt-3 text-[13px] text-fg-dim">
        <span>{ZONES.reduce((s, z) => s + z.count, 0)} parroquias en total</span>
        <span>
          <b className="text-fg">{TOTAL_VEHICLES}</b> vehículos desplegados
        </span>
      </div>
      <ul className="mt-3 mb-0 flex list-none flex-col gap-2 p-0 text-[13.5px] text-fg-dim">
        {FLEET_SOURCES.map((f) => (
          <li key={f.label} className="flex items-center gap-2.5">
            <TruckIcon variant={f.icon} className="h-[18px] w-[26px] shrink-0 text-white" />
            <b className="min-w-[2.6em] text-right text-fg tabular-nums">{f.count}</b>
            <span>{f.label}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
