import { PARISHES, TOTAL_TONS, TOTAL_VEHICLES } from "../data/parishes.js";
import { fmtPct } from "../utils/format.js";
import ParishFinder from "./ParishFinder.jsx";
import Odometer from "./Odometer.jsx";

// Se calcula desde los datos para que la frase siga siendo cierta al actualizar cifras
const ZERO_ZONE = PARISHES.filter((p) => p.zeroZone);
const zeroZoneTons = ZERO_ZONE.reduce((s, p) => s + p.tons, 0);
const zeroZoneAreas = new Intl.ListFormat("es", { type: "conjunction" }).format([
  ...new Set(ZERO_ZONE.map((p) => p.zone)),
]);

// Atendida = recibió algo; si una parroquia llega a 0 t, el KPI lo refleja solo
const SERVED = PARISHES.filter((p) => p.tons > 0);

// Cifra en Ubuntu con dígitos tabulares: en monoespaciada el punto de miles y la unidad
// ocupaban el ancho de un dígito y la cifra se veía separada ("9 . 823 t")
const FIGURE = "font-display font-bold leading-none tracking-[-0.02em] lining-nums tabular-nums";

export default function Header({ onSelectParish }) {
  return (
    // Al abrir la página, título, texto, buscador y cifras entran en cascada (50ms entre
    // cada uno). Es la única entrada animada: la página se visita pocas veces y el resto
    // son datos que no deben moverse mientras se leen
    <header className="mb-6 flex flex-wrap items-start justify-between gap-6">
      <div className="min-w-0 flex-1 basis-[420px]">
        <h1
          data-motion
          className="mt-0 mb-2.5 animate-enter text-[length:clamp(30px,4.4vw,46px)] leading-[1.05] tracking-[-0.035em]"
        >
          Despliegue Logístico
          <br />
          Post-Terremoto
        </h1>
        <p
          data-motion
          className="m-0 max-w-[560px] animate-enter text-[16px] text-fg-dim [animation-delay:50ms]"
        >
          Cobertura total en las {PARISHES.length} parroquias del estado La Guaira. Las{" "}
          {ZERO_ZONE.length} parroquias de Zona Cero, en las zonas {zeroZoneAreas}, recibieron el{" "}
          {fmtPct(zeroZoneTons / TOTAL_TONS)} del volumen.
        </p>
        <div data-motion className="animate-enter [animation-delay:100ms]">
          <ParishFinder onSelect={onSelectParish} />
        </div>
      </div>

      {/* El volumen manda; vehículos y parroquias lo acompañan debajo */}
      <dl
        data-motion
        className="m-0 grid min-w-[320px] animate-enter grid-cols-2 content-start gap-3 [animation-delay:150ms] tiny:w-full tiny:min-w-0"
      >
        <div className="col-span-2 rounded-lg bg-caritas px-6 py-5 text-center">
          {/* Sin etiqueta visible: la unidad "toneladas" ya dice qué es la cifra */}
          <dt className="sr-only">Volumen total entregado</dt>
          <dd className={`m-0 text-white ${FIGURE} text-[length:clamp(44px,5vw,56px)]`}>
            <Odometer value={TOTAL_TONS} />
            <span className="ml-1.5 font-sans text-[0.45em] font-medium tracking-normal text-[#ffffffcc]">
              toneladas
            </span>
          </dd>
        </div>
        <SmallKpi value={TOTAL_VEHICLES} label="Vehículos despachados" />
        <SmallKpi value={SERVED.length} label="Parroquias atendidas" />
      </dl>
    </header>
  );
}

function SmallKpi({ value, label }) {
  return (
    <div className="flex flex-col-reverse justify-end rounded-lg border border-line bg-panel px-5 py-4">
      <dt className="mt-1.5 text-[13px] text-fg-dim">{label}</dt>
      <dd className={`m-0 text-[30px] text-fg ${FIGURE}`}>
        <Odometer value={value} />
      </dd>
    </div>
  );
}
