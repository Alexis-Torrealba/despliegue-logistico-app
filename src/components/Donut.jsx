import { useId } from "react";
import { fmt } from "../utils/format.js";
import { useRevealed } from "./Card.jsx";
import Odometer from "./Odometer.jsx";

const R = 40;
const STROKE = 14;
const C = 2 * Math.PI * R;
// Separación entre tramos, en unidades del viewBox
const GAP = 1.4;

// Dona en SVG (sin librería de gráficos): cada tramo es un arco del mismo círculo
// recortado con stroke-dasharray, empezando arriba y en sentido horario.
// Al entrar en pantalla una máscara la dibuja en un solo trazo mientras gira un cuarto
// de vuelta hasta su sitio; con `active` un tramo se destaca y el centro muestra su cifra
export default function Donut({
  segments,
  centerValue,
  centerLabel,
  size = 184,
  active = null,
  onActiveChange,
}) {
  // Sin los ":" que trae useId, que algunos navegadores no aceptan dentro de url(#…)
  const maskId = `donut${useId().replace(/:/g, "")}`;
  const revealed = useRevealed();
  const total = segments.reduce((s, x) => s + x.value, 0);
  const current = segments.find((s) => s.label === active);
  let offset = 0;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        className="h-full w-full transition-[rotate] duration-[1400ms] ease-[var(--ease-out-expo)] motion-reduce:transition-none"
        style={{ rotate: revealed ? "-90deg" : "-200deg" }}
        role="img"
        aria-label={`Gráfico de dona: ${segments.map((s) => `${s.label}, ${fmt(s.value)} t`).join("; ")}`}
        onMouseLeave={() => onActiveChange?.(null)}
      >
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
          <circle
            cx="50"
            cy="50"
            r={R}
            fill="none"
            stroke="white"
            strokeWidth={STROKE + 4}
            strokeDasharray={C}
            strokeDashoffset={revealed ? 0 : C}
            className="transition-[stroke-dashoffset] duration-[1400ms] ease-[var(--ease-out-expo)] motion-reduce:transition-none"
          />
        </mask>
        <circle
          cx="50"
          cy="50"
          r={R}
          fill="none"
          stroke="var(--color-bg-alt)"
          strokeWidth={STROKE}
        />
        <g mask={`url(#${maskId})`}>
          {segments.map((s) => {
            const len = (s.value / total) * C;
            const dash = Math.max(len - GAP, 0.5);
            const dim = active && active !== s.label;
            const el = (
              <circle
                key={s.label}
                cx="50"
                cy="50"
                r={R}
                fill="none"
                stroke={s.color}
                strokeWidth={active === s.label ? STROKE + 3 : STROKE}
                strokeDasharray={`${dash} ${C - dash}`}
                strokeDashoffset={-offset}
                opacity={dim ? 0.28 : 1}
                className="transition-[opacity,stroke-width] duration-200 ease-out"
                onMouseEnter={() => onActiveChange?.(s.label)}
              >
                <title>{`${s.label}: ${fmt(s.value)} t`}</title>
              </circle>
            );
            offset += len;
            return el;
          })}
        </g>
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-[24px] font-semibold leading-none tracking-[-0.04em] tabular-nums">
          <Odometer value={current ? current.value : centerValue} active={revealed} />
        </div>
        {/* La etiqueta cambia con un fundido corto; la clave reinicia la entrada */}
        <div
          key={current?.label ?? "total"}
          className="mt-1 animate-[enter-fade_200ms_ease-out] text-[12px] font-medium text-fg-dim"
        >
          {current ? current.label : centerLabel}
        </div>
      </div>
    </div>
  );
}
