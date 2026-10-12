import { useCallback, useMemo, useState } from "react";
import Card from "./Card.jsx";
import { PARISHES, ZONE_COLORS } from "../data/parishes.js";
import { fmt } from "../utils/format.js";
import ParishModal from "./ParishModal.jsx";
import TruckIcon from "./TruckIcon.jsx";
import ZonePill from "./ZonePill.jsx";
import { TABS_ROW, tabClass } from "./tabs.js";

// En móvil la tabla queda en Parroquia y Toneladas, sin scroll horizontal;
// las filas de Zona Cero se distinguen solo por el sombreado
const DESKTOP_ONLY = "mobile:hidden";

const TH =
  "cursor-pointer select-none whitespace-nowrap border-b-2 border-line px-2.5 py-2 text-[11px] font-bold uppercase tracking-[0.06em] text-fg-dim hover:text-caritas-soft";
const TD = "border-b border-line p-2.5";
const NUM = "text-right tabular-nums mobile:whitespace-nowrap";

export default function ParishTable({ zoneFilter, setZoneFilter }) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("tons");
  const [sortDir, setSortDir] = useState("desc");
  const [selected, setSelected] = useState(null);
  const closeModal = useCallback(() => setSelected(null), []);

  const filtered = useMemo(() => {
    let rows = PARISHES.filter(
      (p) =>
        (zoneFilter === "Todas" || p.zone === zoneFilter) &&
        p.name.toLowerCase().includes(query.toLowerCase()),
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
    <Card id="detalle" title="Desglose completo — 26 parroquias">
      <div className="-mt-1.5 mb-4 flex items-center gap-2 text-[12.5px] text-fg-dim">
        <span className="h-2.5 w-3.5 shrink-0 rounded-[3px] bg-[rgba(196,81,63,0.35)] shadow-[inset_3px_0_0_var(--color-caritas-soft)]"></span>
        Zona Cero: parroquias con mayor devastación tras el doblete sísmico
      </div>

      <div className={TABS_ROW}>
        {["Todas", ...Object.keys(ZONE_COLORS)].map((z) => (
          <div key={z} className={tabClass(zoneFilter === z)} onClick={() => setZoneFilter(z)}>
            {z}
          </div>
        ))}
      </div>

      <div className="mb-3.5 flex flex-wrap gap-2.5">
        <input
          type="text"
          className="min-w-[180px] flex-1 rounded-[10px] border border-line bg-panel-2 px-3.5 py-2.5 text-[14px] text-fg outline-none placeholder:text-[#8a8076] focus:border-caritas-soft focus:shadow-[0_0_0_3px_#d9776a26]"
          placeholder="Buscar parroquia..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-[3px] [&::-webkit-scrollbar-thumb]:bg-line">
        <table className="w-full border-collapse text-[14px]">
          <thead>
            <tr>
              <th className={`${TH} text-left`} onClick={() => toggleSort("name")}>
                Parroquia {arrow("name")}
              </th>
              <th className={`${TH} text-left ${DESKTOP_ONLY}`} onClick={() => toggleSort("zone")}>
                Zona {arrow("zone")}
              </th>
              <th className={`${TH} text-right`} onClick={() => toggleSort("tons")}>
                Toneladas {arrow("tons")}
              </th>
              <th
                className={`${TH} text-right ${DESKTOP_ONLY}`}
                onClick={() => toggleSort("vehicles")}
              >
                Vehículos {arrow("vehicles")}
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr
                key={p.name}
                className={`cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-caritas-soft ${
                  p.zeroZone
                    ? "bg-[rgba(196,81,63,0.16)] hover:bg-[rgba(196,81,63,0.26)]"
                    : "hover:bg-panel-2"
                }`}
                tabIndex={0}
                aria-label={`${p.name}: ver detalle`}
                onClick={() => setSelected(p)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelected(p);
                  }
                }}
              >
                <td
                  className={`${TD} ${p.zeroZone ? "shadow-[inset_3px_0_0_var(--color-caritas-soft)]" : ""}`}
                >
                  {p.name}
                  {p.zeroZone && (
                    <span className="ml-2 inline-block whitespace-nowrap rounded-full bg-caritas px-[7px] py-px align-middle text-[10px] font-bold uppercase tracking-[0.04em] text-white mobile:hidden">
                      Zona Cero
                    </span>
                  )}
                </td>
                <td className={`${TD} ${DESKTOP_ONLY}`}>
                  <ZonePill zone={p.zone} />
                </td>
                <td className={`${TD} ${NUM}`}>{fmt(p.tons)} t</td>
                <td className={`${TD} ${NUM} ${DESKTOP_ONLY}`}>
                  {p.vehicles}
                  <TruckIcon />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="4" className="border-b border-line py-5 text-center text-fg-dim">
                  Sin resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {selected && <ParishModal parish={selected} onClose={closeModal} />}
    </Card>
  );
}
