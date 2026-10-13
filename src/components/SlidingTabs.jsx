import { useClipIndicator } from "../hooks/useClipIndicator.js";
import { tabClass } from "./tabs.js";

const ROW = "flex flex-wrap gap-1.5";

// Fila de pestañas (mapa y desglose) con el indicador que se desliza. Los botones reales
// llevan el estado accesible; la copia de encima es solo visual y no recibe clics
export default function SlidingTabs({ items, active, onSelect, mode = "tablist", label }) {
  const index = items.indexOf(active);
  const [wrapRef, overlayStyle] = useClipIndicator(index);
  const a11y = (on) =>
    mode === "tablist" ? { role: "tab", "aria-selected": on } : { "aria-pressed": on };

  return (
    <div ref={wrapRef} className="relative mb-4">
      <div className={ROW} role={mode === "tablist" ? "tablist" : "group"} aria-label={label}>
        {items.map((item) => (
          <button
            key={item}
            type="button"
            data-tab
            className={`${tabClass(false)} leading-[normal]`}
            {...a11y(item === active)}
            onClick={() => onSelect(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <div
        className={`${ROW} pointer-events-none absolute inset-0`}
        style={overlayStyle}
        aria-hidden="true"
      >
        {/* inline-flex: un span no centra su texto en vertical como el botón real */}
        {items.map((item) => (
          <span
            key={item}
            className={`${tabClass(true)} inline-flex items-center justify-center leading-[normal]`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
