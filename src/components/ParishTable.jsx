import { useMemo, useState } from "react";
import { PARISHES, ZONE_COLORS } from "../data/parishes.js";
import { fmt } from "../utils/format.js";

export default function ParishTable({ zoneFilter, setZoneFilter }) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("tons");
  const [sortDir, setSortDir] = useState("desc");

  const filtered = useMemo(() => {
    let rows = PARISHES.filter(
      (p) =>
        (zoneFilter === "Todas" || p.zone === zoneFilter) &&
        p.name.toLowerCase().includes(query.toLowerCase())
    );
    rows.sort((a, b) => {
      let av = a[sortKey];
      let bv = b[sortKey];
      if (typeof av === "string") {
        av = av.toLowerCase();
        bv = bv.toLowerCase();
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return rows;
  }, [query, zoneFilter, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const arrow = (key) => (sortKey === key ? (sortDir === "asc" ? "↑" : "↓") : "");

  return (
    <div id="detalle" className="card">
      <h2>Desglose completo — 26 parroquias</h2>
      <div className="desc">Filtra por zona o busca una parroquia; ordena por columna</div>

      <div className="tabs">
        {["Todas", ...Object.keys(ZONE_COLORS)].map((z) => (
          <div
            key={z}
            className={`tab ${zoneFilter === z ? "active" : ""}`}
            onClick={() => setZoneFilter(z)}
          >
            {z}
          </div>
        ))}
      </div>

      <div className="search-row">
        <input
          type="text"
          placeholder="Buscar parroquia..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th onClick={() => toggleSort("name")}>Parroquia {arrow("name")}</th>
              <th onClick={() => toggleSort("zone")}>Zona {arrow("zone")}</th>
              <th onClick={() => toggleSort("tons")} style={{ textAlign: "right" }}>
                Toneladas {arrow("tons")}
              </th>
              <th onClick={() => toggleSort("vehicles")} style={{ textAlign: "right" }}>
                Vehículos {arrow("vehicles")}
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.name}>
                <td>{p.name}</td>
                <td>
                  <span
                    className="zone-pill"
                    style={{
                      background: `${ZONE_COLORS[p.zone]}1f`,
                      color: ZONE_COLORS[p.zone],
                      border: `1px solid ${ZONE_COLORS[p.zone]}44`,
                    }}
                  >
                    <span className="d" style={{ background: ZONE_COLORS[p.zone] }}></span>
                    {p.zone}
                  </span>
                </td>
                <td className="num-cell">{fmt(p.tons)} t</td>
                <td className="num-cell">{p.vehicles}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", color: "#8b93ab", padding: "20px 0" }}>
                  Sin resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
