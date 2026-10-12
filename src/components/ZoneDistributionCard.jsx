import Card from "./Card.jsx";
import Doughnut from "./Doughnut.jsx";
import { Legend, LegendItem } from "./Legend.jsx";
import { DONORS, DONOR_COLORS, FLEET_SOURCES } from "../data/donors.js";
import { TOTAL_TONS, TOTAL_VEHICLES, ZONES } from "../data/parishes.js";
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
      <Legend className="mt-3">
        {FLEET_SOURCES.map((f) => (
          <LegendItem
            key={f.donor}
            color={DONOR_COLORS[DONORS.findIndex((d) => d.name === f.donor)]}
            value={
              <>
                {f.count}
                <TruckIcon
                  variant={f.icon}
                  className="ml-2 inline-block h-[15px] w-[22px] align-[-3px] text-white"
                />
              </>
            }
          >
            {f.donor}
          </LegendItem>
        ))}
      </Legend>
    </Card>
  );
}
