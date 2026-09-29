import { TOTAL_TONS, TOTAL_VEHICLES, ZONES } from "../data/parishes.js";
import { fmt } from "../utils/format.js";

export default function Header({ zoneFilter, setZoneFilter }) {
  return (
    <>
      <header className="top">
        <div>
          <div className="eyebrow">
            <span className="dot"></span>La Guaira · Respuesta Humanitaria
          </div>
          <h1>
            Despliegue Logístico
            <br />
            Post-Terremoto
          </h1>
          <p className="sub">
            Cobertura total en las 26 parroquias del estado La Guaira, con prioridad operacional en
            las Zonas Cero (Este y Catia La Mar).
          </p>
        </div>
        <div className="kpis">
          <div className="kpi accent">
            <div className="val">{fmt(TOTAL_TONS)} t</div>
            <div className="lbl">Volumen total</div>
          </div>
          <div className="kpi">
            <div className="val">26</div>
            <div className="lbl">Parroquias</div>
          </div>
          <div className="kpi">
            <div className="val">{TOTAL_VEHICLES}</div>
            <div className="lbl">Vehículos</div>
          </div>
          <div className="kpi">
            <div className="val">100%</div>
            <div className="lbl">Cobertura</div>
          </div>
        </div>
      </header>

      <nav className="zone-nav" aria-label="Navegación por zonas">
        <span className="zn-label">Ir a:</span>
        <a href="#resumen" onClick={() => setZoneFilter("Todas")}>
          Resumen
        </a>
        <a href="#donantes">Donantes</a>
        <a href="#top">Top parroquias</a>
        <span className="sep"></span>
        {ZONES.map((z) => (
          <a
            key={z.name}
            href="#detalle"
            className={zoneFilter === z.name ? "on" : ""}
            style={zoneFilter === z.name ? { background: z.color, borderColor: z.color } : {}}
            onClick={() => setZoneFilter(z.name)}
          >
            <span
              className="d"
              style={{ background: zoneFilter === z.name ? "rgba(255,255,255,0.75)" : z.color }}
            ></span>
            {z.name}
          </a>
        ))}
      </nav>
    </>
  );
}
