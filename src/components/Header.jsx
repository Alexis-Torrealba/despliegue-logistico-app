import { TOTAL_TONS, TOTAL_VEHICLES, ZONES } from "../data/parishes.js";
import { fmt } from "../utils/format.js";

function Kpi({ value, label, accent }) {
  return (
    <div
      className={`rounded-[14px] border border-t-[3px] px-[18px] py-4 ${
        accent
          ? "border-caritas bg-[linear-gradient(160deg,var(--color-caritas),var(--color-caritas-dark))]"
          : "border-line border-t-caritas bg-[linear-gradient(160deg,var(--color-panel-2),var(--color-panel))]"
      }`}
    >
      <div className={`font-serif text-[26px] font-bold ${accent ? "text-white" : "text-fg"}`}>
        {value}
      </div>
      <div
        className={`mt-1 text-[11.5px] font-semibold uppercase tracking-[0.08em] ${
          accent ? "text-white" : "text-fg-dim"
        }`}
      >
        {label}
      </div>
    </div>
  );
}

const navLink =
  "inline-flex shrink-0 cursor-pointer items-center gap-[7px] whitespace-nowrap rounded-full border border-line bg-panel-2 px-[13px] py-[7px] text-[12.5px] font-semibold no-underline transition-all duration-150 ease-[ease]";
const navIdle = "text-fg-dim hover:border-caritas-soft hover:text-fg";

export default function Header({ zoneFilter, setZoneFilter }) {
  return (
    <>
      <header className="mb-6 flex flex-wrap items-start justify-between gap-6">
        <div>
          <div className="mb-2.5 inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.14em] text-caritas-soft">
            <span className="h-[7px] w-[7px] rounded-full bg-caritas-soft shadow-[0_0_10px_var(--color-caritas-soft)]"></span>
            La Guaira · Respuesta Humanitaria
          </div>
          <h1 className="mt-0 mb-2.5 text-[length:clamp(28px,4vw,42px)] leading-[1.15]">
            Despliegue Logístico
            <br />
            Post-Terremoto
          </h1>
          <p className="m-0 max-w-[560px] text-[16px] text-fg-dim">
            Cobertura total en las 26 parroquias del estado La Guaira, con prioridad operacional en
            las Zonas Cero (Este y Catia La Mar).
          </p>
        </div>
        <div className="grid min-w-[320px] grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3.5 tiny:w-full tiny:min-w-0">
          <Kpi accent value={`${fmt(TOTAL_TONS)} t`} label="Volumen total" />
          <Kpi value="26" label="Parroquias" />
          <Kpi value={TOTAL_VEHICLES} label="Vehículos" />
          <Kpi value="100%" label="Cobertura" />
        </div>
      </header>

      <nav
        className="sticky top-[env(safe-area-inset-top,0px)] z-40 mb-[26px] flex items-center gap-2 overflow-x-auto rounded-[14px] border border-line bg-[rgba(18,16,14,0.82)] px-2.5 py-[9px] backdrop-blur-[10px] [&::-webkit-scrollbar]:hidden"
        aria-label="Navegación por zonas"
      >
        <span className="shrink-0 pr-1.5 pl-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-fg-dim">
          Ir a:
        </span>
        <a
          className={`${navLink} ${navIdle}`}
          href="#resumen"
          onClick={() => setZoneFilter("Todas")}
        >
          Resumen
        </a>
        <a className={`${navLink} ${navIdle}`} href="#donantes">
          Donantes
        </a>
        <a className={`${navLink} ${navIdle}`} href="#top">
          Top parroquias
        </a>
        <span className="mx-0.5 h-5 w-px shrink-0 bg-line"></span>
        {ZONES.map((z) => {
          const on = zoneFilter === z.name;
          return (
            <a
              key={z.name}
              href="#detalle"
              className={`${navLink} ${on ? "text-white" : navIdle}`}
              style={on ? { background: z.color, borderColor: z.color } : {}}
              onClick={() => setZoneFilter(z.name)}
            >
              <span
                className="h-[7px] w-[7px] shrink-0 rounded-full"
                style={{ background: on ? "rgba(255,255,255,0.75)" : z.color }}
              ></span>
              {z.name}
            </a>
          );
        })}
      </nav>
    </>
  );
}
