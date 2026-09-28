import { PARISHES, ZONE_COLORS } from "../data/parishes.js";
import { fmt } from "../utils/format.js";

export default function TopParishesCard() {
  const topParishes = [...PARISHES].sort((a, b) => b.tons - a.tons).slice(0, 8);
  const maxTons = Math.max(...PARISHES.map((p) => p.tons));

  return (
    <div id="top" className="card" style={{ marginBottom: 18 }}>
      <h2>Top parroquias por volumen</h2>
      <div className="desc">Las 8 parroquias con mayor cantidad de ayuda recibida</div>
      <div className="bars">
        {topParishes.map((p) => (
          <div className="bar-row" key={p.name}>
            <div className="name">{p.name}</div>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{
                  width: `${(p.tons / maxTons) * 100}%`,
                  background: ZONE_COLORS[p.zone],
                }}
              ></div>
            </div>
            <div className="amt">{fmt(p.tons)} t</div>
          </div>
        ))}
      </div>
    </div>
  );
}
