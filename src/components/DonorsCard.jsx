import Card from "./Card.jsx";
import { DONORS } from "../data/donors.js";
import { TOTAL_TONS } from "../data/parishes.js";
import { fmt, fmtPct } from "../utils/format.js";
import TruckIcon from "./TruckIcon.jsx";

// Barras horizontales con etiqueta en vez de dona: con un donante que aporta más de la
// mitad, la longitud se compara de un vistazo y cada fila se lee sin depender del color.
// De mayor a menor, con "Otras donaciones" siempre al final
const OTHERS = "Otras donaciones";
const rows = [...DONORS].sort(
  (a, b) => (a.name === OTHERS) - (b.name === OTHERS) || b.tons - a.tons,
);
const maxTons = Math.max(...DONORS.map((d) => d.tons));

export default function DonorsCard() {
  return (
    // Si la tarjeta de zonas de al lado es más alta, las filas se reparten en la altura
    // sobrante en vez de dejar un hueco al final
    <Card
      id="donantes"
      className="flex flex-col"
      title="Fuentes de donación"
      desc={`Origen del volumen consolidado (${fmt(TOTAL_TONS)} t) y vehículos que aportó cada donante`}
    >
      <ul className="bar-list m-0 flex flex-1 list-none flex-col justify-between gap-4 p-0">
        {rows.map((d, i) => (
          <li key={d.name} style={{ "--i": i }}>
            <div className="mb-1.5 flex items-baseline justify-between gap-3 text-[13.5px]">
              <span className="min-w-0 text-fg">
                {d.name} <span className="text-fg-dim">· {d.note}</span>
                <span className="block text-[12.5px] text-fg-dim tabular-nums">
                  <TruckIcon
                    variant={d.icon}
                    className={`mr-1.5 inline-block align-[-3px] text-fg-dim ${
                      d.icon === "gandola" ? "h-[15px] w-[22px]" : "h-[15px] w-[15px]"
                    }`}
                  />
                  {d.vehicles} vehículos
                </span>
              </span>
              <span className="shrink-0 text-[13px] text-fg-dim tabular-nums">
                <b className="font-semibold text-fg">{fmt(d.tons)} t</b> ·{" "}
                {fmtPct(d.tons / TOTAL_TONS)}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-[2px] bg-bg-alt" aria-hidden="true">
              <div
                className="bar-fill h-full rounded-[2px] bg-fg-dim"
                style={{ width: `${Math.max((d.tons / maxTons) * 100, 0.6)}%` }}
              ></div>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
