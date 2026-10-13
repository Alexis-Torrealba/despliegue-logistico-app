import { useState } from "react";
import Card from "./Card.jsx";
import Donut from "./Donut.jsx";
import { PARISHES, TOTAL_TONS, ZONES } from "../data/parishes.js";
import { fmt, fmtPct } from "../utils/format.js";

// Arriba, la dona con el reparto completo y un resumen calculado de los datos; debajo,
// una fila por zona con barra, el mismo lenguaje que la tarjeta de donantes de al lado
const rows = [...ZONES].sort((a, b) => b.tons - a.tons);
const maxTons = rows[0].tons;
const top = rows.slice(0, 2);
const topShare = top.reduce((s, z) => s + z.tons, 0) / TOTAL_TONS;
const ZERO_ZONE = PARISHES.filter((p) => p.zeroZone);
const zeroZoneTons = ZERO_ZONE.reduce((s, p) => s + p.tons, 0);

export default function ZoneDistributionCard() {
  // Zona destacada al pasar por su fila o su tramo: la dona y la lista se responden
  const [active, setActive] = useState(null);
  return (
    <Card
      id="por-zona"
      className="flex flex-col"
      title="Distribución por zona"
      desc="Toneladas de ayuda entregadas, por zona geográfica"
    >
      <div className="flex flex-1 flex-col justify-between gap-6">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-5 narrow:justify-center">
          <Donut
            segments={rows.map((z) => ({ label: z.name, value: z.tons, color: z.color }))}
            centerValue={fmt(TOTAL_TONS)}
            centerLabel="toneladas"
            size={156}
            active={active}
            onActiveChange={setActive}
          />
          <div className="min-w-[200px] flex-1 basis-[220px]">
            <p className="m-0 text-[17px] leading-[1.4] text-balance text-fg">
              {top.map((z) => z.name).join(" y ")} concentran el{" "}
              <b className="font-semibold">{fmtPct(topShare)}</b> de las toneladas.
            </p>
            <p className="mt-2 mb-0 text-[13.5px] text-pretty text-fg-dim">
              Las {ZERO_ZONE.length} parroquias de Zona Cero recibieron el{" "}
              {fmtPct(zeroZoneTons / TOTAL_TONS)} del volumen.
            </p>
          </div>
        </div>

        <ul
          className="bar-list m-0 flex list-none flex-col gap-4 p-0"
          onMouseLeave={() => setActive(null)}
        >
          {rows.map((z, i) => (
            <li
              key={z.name}
              style={{ "--i": i }}
              className={active && active !== z.name ? "opacity-42" : ""}
              onMouseEnter={() => setActive(z.name)}
            >
              <div className="mb-1.5 flex items-baseline justify-between gap-3 text-[13.5px]">
                <span className="min-w-0 text-fg">
                  <span
                    className="mr-2 inline-block h-2.5 w-2.5 rounded-[2px] align-[-1px]"
                    style={{ background: z.color }}
                  ></span>
                  {z.name}
                  <span className="block pl-[18px] text-[12.5px] text-fg-dim tabular-nums">
                    {z.count} parroquias · {z.vehicles} vehículos
                  </span>
                </span>
                <span className="shrink-0 text-[13px] text-fg-dim tabular-nums">
                  <b className="font-semibold text-fg">{fmt(z.tons)} t</b> ·{" "}
                  {fmtPct(z.tons / TOTAL_TONS)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-[2px] bg-bg-alt" aria-hidden="true">
                <div
                  className="bar-fill h-full rounded-[2px]"
                  style={{ width: `${(z.tons / maxTons) * 100}%`, background: z.color }}
                ></div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
