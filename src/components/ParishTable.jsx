import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { prefersReducedMotion } from "../hooks/useInView.js";
import Card from "./Card.jsx";
import { PARISHES, ZONE_COLORS } from "../data/parishes.js";
import { fmt, normalize } from "../utils/format.js";
import TruckIcon from "./TruckIcon.jsx";
import ZonePill from "./ZonePill.jsx";
import ZeroZoneTag from "./ZeroZoneTag.jsx";
import { tabClass } from "./tabs.js";
import SlidingTabs from "./SlidingTabs.jsx";

// En móvil la tabla queda en Parroquia y Toneladas, sin scroll horizontal;
// las filas de Zona Cero se distinguen por el sombreado y la etiqueta "ZC"
const DESKTOP_ONLY = "mobile:hidden";

const TH =
  "whitespace-nowrap border-b-2 border-line px-2.5 py-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-fg-dim";
// El botón ocupa el encabezado para que el orden se pueda cambiar también con teclado
const SORT_BUTTON =
  "cursor-pointer select-none border-0 bg-transparent p-0 font-[inherit] uppercase tracking-[inherit] text-inherit transition-colors duration-200 hover:text-caritas-soft";
const TD = "border-b border-line p-2.5";
const NUM = "text-right tabular-nums mobile:whitespace-nowrap";

export default function ParishTable({ onSelectParish }) {
  const [zoneFilter, setZoneFilter] = useState("Todas");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("tons");
  const [sortDir, setSortDir] = useState("desc");

  const filtered = useMemo(() => {
    const q = normalize(query);
    let rows = PARISHES.filter(
      (p) => (zoneFilter === "Todas" || p.zone === zoneFilter) && normalize(p.name).includes(q),
    );
    rows.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp = typeof av === "string" ? av.localeCompare(bv, "es") : av - bv;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return rows;
  }, [query, zoneFilter, sortKey, sortDir]);

  // Al ordenar o filtrar, cada fila se desliza desde donde estaba hasta su nuevo lugar
  // (FLIP: se mide antes y después y se anima la diferencia). Así se sigue con la vista
  // a dónde fue una parroquia en vez de reencontrarla en una tabla que saltó entera
  const bodyRef = useRef(null);
  const lastTops = useRef(null);
  useLayoutEffect(() => {
    const rows = [...bodyRef.current.querySelectorAll("tr[data-key]")];
    const tops = new Map(rows.map((r) => [r.dataset.key, r.offsetTop]));
    const prev = lastTops.current;
    lastTops.current = tops;
    if (!prev || prefersReducedMotion()) return;
    rows.forEach((row) => {
      const before = prev.get(row.dataset.key);
      if (before === undefined) {
        // Las que vuelven por el filtro aparecen en su sitio
        row.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: 260,
          delay: 90,
          easing: "ease-out",
          fill: "backwards",
        });
        return;
      }
      const dy = before - tops.get(row.dataset.key);
      if (!dy) return;
      row.animate([{ transform: `translateY(${dy}px)` }, { transform: "none" }], {
        duration: 460,
        easing: "cubic-bezier(0.65, 0, 0.35, 1)",
      });
    });
  }, [filtered]);

  // Si la búsqueda falla solo por el filtro de zona, se ofrece buscar en todas
  const matchesElsewhere =
    filtered.length === 0 &&
    zoneFilter !== "Todas" &&
    PARISHES.some((p) => normalize(p.name).includes(normalize(query)));

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  // Una sola flecha que gira al invertir el orden, en vez de cambiar de carácter
  const arrow = (key) =>
    sortKey === key && (
      <span
        aria-hidden="true"
        className={`inline-block transition-[rotate] duration-250 ease-[var(--ease-out)] ${
          sortDir === "asc" ? "rotate-180" : ""
        }`}
      >
        <svg className="ml-0.5 inline-block h-2.5 w-2.5 align-[-1px]" viewBox="0 0 12 12">
          <path
            d="M6 2v8m-3.5-3.5L6 10l3.5-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );

  const header = (key, label, className) => (
    <th
      className={`${TH} ${className}`}
      aria-sort={
        sortKey === key ? (sortDir === "asc" ? "ascending" : "descending") : undefined
      }
    >
      <button type="button" className={SORT_BUTTON} onClick={() => toggleSort(key)}>
        {label}
        {arrow(key)}
      </button>
    </th>
  );

  return (
    <Card
      id="detalle"
      // Espacio indivisible antes de la raya: al cortar en móvil, la raya no abre la línea
      title={`Desglose completo — ${PARISHES.length} parroquias`}
    >
      {/* La leyenda usa la misma etiqueta que las filas, así se reconoce sin explicarla */}
      <p className="-mt-1.5 mb-4 flex items-baseline gap-2 text-[12.5px] text-fg-dim">
        <ZeroZoneTag />
        <span>parroquias con mayor devastación tras el doblete sísmico</span>
      </p>

      <SlidingTabs
        items={["Todas", ...Object.keys(ZONE_COLORS)]}
        active={zoneFilter}
        onSelect={setZoneFilter}
        mode="toggle"
        label="Filtrar por zona"
      />

      <div className="mb-3.5 flex flex-wrap items-center gap-x-3 gap-y-2">
        <input
          type="search"
          enterKeyHint="search"
          className="min-w-[180px] flex-1 rounded-md border border-line bg-panel-2 px-3.5 py-2.5 text-[14px] text-fg mobile:text-[16px] outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-[#9d9387] focus:border-caritas-soft focus:shadow-[0_0_0_3px_#d9776a26]"
          placeholder="Buscar parroquia…"
          aria-label="Buscar parroquia"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <p className="m-0 text-[12.5px] text-fg-dim tabular-nums" aria-live="polite">
          {filtered.length} de {PARISHES.length} parroquias
        </p>
      </div>

      <div className="overflow-x-auto [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-[3px] [&::-webkit-scrollbar-thumb]:bg-line">
        <table className="w-full border-collapse text-[14px]">
          <thead>
            <tr>
              {header("name", "Parroquia", "text-left")}
              {header("zone", "Zona", `text-left ${DESKTOP_ONLY}`)}
              {header("tons", "Toneladas", "text-right")}
              {header("vehicles", "Vehículos", `text-right ${DESKTOP_ONLY}`)}
            </tr>
          </thead>
          <tbody ref={bodyRef}>
            {filtered.map((p) => (
              <tr
                key={p.name}
                data-key={p.name}
                className={`flip-row cursor-pointer transition-colors duration-150 ease-out focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-caritas-soft ${
                  p.zeroZone
                    ? "bg-[rgba(196,81,63,0.16)] hover:bg-[rgba(196,81,63,0.26)] active:bg-[rgba(196,81,63,0.34)]"
                    : "hover:bg-panel-2 active:bg-bg-alt"
                }`}
                tabIndex={0}
                aria-label={`${p.name}${p.zeroZone ? ", Zona Cero" : ""}: ${fmt(p.tons)} toneladas, ${p.vehicles} vehículos. Ver detalle`}
                onClick={() => onSelectParish(p)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectParish(p);
                  }
                }}
              >
                <td
                  className={TD}
                >
                  {p.name}
                  {p.zeroZone && (
                    // En móvil la etiqueta se abrevia a "ZC" (explicado en la leyenda) para que
                    // la Zona Cero no dependa solo del sombreado de la fila
                    <ZeroZoneTag className="ml-2 align-middle" aria-hidden="true" />
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
                <td colSpan="4" className="border-b border-line px-2.5 py-6 text-center">
                  <p className="m-0 text-fg">
                    Ninguna parroquia coincide con «{query.trim()}»
                    {zoneFilter !== "Todas" && ` en la zona ${zoneFilter}`}.
                  </p>
                  <div className="mt-3 flex flex-wrap justify-center gap-2">
                    {matchesElsewhere && (
                      <button
                        type="button"
                        className={`${tabClass(true)} leading-[normal]`}
                        onClick={() => setZoneFilter("Todas")}
                      >
                        Buscar en todas las zonas
                      </button>
                    )}
                    <button
                      type="button"
                      className={`${tabClass(false)} leading-[normal]`}
                      onClick={() => setQuery("")}
                    >
                      Borrar búsqueda
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

