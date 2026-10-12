import Doughnut from "./Doughnut.jsx";
import { FLEET_SOURCES, TOTAL_TONS, TOTAL_VEHICLES, ZONES } from "../data/parishes.js";
import TruckIcon from "./TruckIcon.jsx";
import { fmt } from "../utils/format.js";

export default function ZoneDistributionCard() {
  const sorted = [...ZONES].sort((a, b) => b.tons - a.tons);

  return (
    <div id="por-zona" className="card">
      <h2>Distribución por zona</h2>
      <div className="desc">Toneladas de ayuda entregadas, por zona geográfica</div>
      <div className="chart-row">
        <Doughnut
          labels={ZONES.map((z) => z.name)}
          data={ZONES.map((z) => z.tons)}
          colors={ZONES.map((z) => z.color)}
          centerLabel="Toneladas"
          centerValue={fmt(TOTAL_TONS)}
        />
        <div className="legend">
          {sorted.map((z) => (
            <div className="item" key={z.name}>
              <span className="sw" style={{ background: z.color }}></span>
              <span className="name">{z.name}</span>
              <span className="num">
                {fmt(z.tons)} t · {((z.tons / TOTAL_TONS) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="foot-total">
        <span>{ZONES.reduce((s, z) => s + z.count, 0)} parroquias en total</span>
        <span>
          <b>{TOTAL_VEHICLES}</b> vehículos desplegados
        </span>
      </div>
      <ul className="fleet-list">
        {FLEET_SOURCES.map((f) => (
          <li key={f.label}>
            <TruckIcon variant={f.icon} />
            <b>{f.count}</b>
            <span>{f.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
