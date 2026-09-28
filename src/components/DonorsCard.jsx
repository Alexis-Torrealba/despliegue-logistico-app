import Doughnut from "./Doughnut.jsx";
import { DONORS, DONOR_COLORS } from "../data/donors.js";
import { TOTAL_TONS } from "../data/parishes.js";
import { fmt } from "../utils/format.js";

export default function DonorsCard() {
  return (
    <div id="donantes" className="card">
      <h2>Fuentes de donación</h2>
      <div className="desc">Origen del volumen consolidado ({fmt(TOTAL_TONS)} t)</div>
      <div className="chart-row" style={{ flexDirection: "column", alignItems: "stretch" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Doughnut
            labels={DONORS.map((d) => d.name)}
            data={DONORS.map((d) => d.tons)}
            colors={DONOR_COLORS}
            centerLabel="Donantes"
            centerValue={DONORS.length}
          />
        </div>
        <div className="legend" style={{ marginTop: 14 }}>
          {DONORS.map((d, i) => (
            <div className="item" key={d.name}>
              <span className="sw" style={{ background: DONOR_COLORS[i] }}></span>
              <span className="name">
                {d.name} <span style={{ color: "#8b93ab" }}>· {d.note}</span>
              </span>
              <span className="num">{fmt(d.tons)} t</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
