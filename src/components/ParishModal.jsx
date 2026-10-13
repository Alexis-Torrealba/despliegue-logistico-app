import { useCallback, useEffect, useRef, useState } from "react";
import { ZONE_COLORS } from "../data/parishes.js";
import TruckIcon from "./TruckIcon.jsx";
import { fmt } from "../utils/format.js";
import ZonePill from "./ZonePill.jsx";
import ZeroZoneTag from "./ZeroZoneTag.jsx";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Duración de entrada y salida; el desmontaje de respaldo espera un poco más
const DURATION = 250;

export default function ParishModal({ parish, onClose }) {
  const closeRef = useRef(null);
  const dialogRef = useRef(null);
  const color = ZONE_COLORS[parish.zone];
  // Al cerrar, primero se anima la salida y al terminar se desmonta (onClose)
  const [closing, setClosing] = useState(false);
  const requestClose = useCallback(() => setClosing(true), []);

  // Respaldo por si transitionend no llega (pestaña en segundo plano, sin transiciones)
  useEffect(() => {
    if (!closing) return;
    const t = setTimeout(onClose, DURATION + 50);
    return () => clearTimeout(t);
  }, [closing, onClose]);

  useEffect(() => {
    const previous = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") return requestClose();
      if (e.key !== "Tab") return;
      // Tab y Shift+Tab dan la vuelta dentro del modal en vez de salir a la página de fondo
      const items = [...dialogRef.current.querySelectorAll(FOCUSABLE)];
      const first = items[0];
      const last = items[items.length - 1];
      if (!dialogRef.current.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    // La página de fondo no se desplaza mientras el modal está abierto
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, [requestClose]);

  // Entrada con @starting-style (variante starting:): el panel sube, crece desde su centro
  // (no está anclado a un botón) y su contenido llega en cascada detrás. La salida es más
  // corta que la entrada: cerrar es una respuesta, no una presentación.
  // El fondo se funde a la par para que se lean como una sola superficie
  return (
    <div
      className={`fixed inset-0 z-100 grid place-items-center bg-[rgba(10,8,7,0.72)] p-4 backdrop-blur-[4px] transition-opacity duration-300 ease-out starting:opacity-0 ${
        closing ? "pointer-events-none opacity-0 duration-150!" : ""
      }`}
      onClick={requestClose}
    >
      <div
        ref={dialogRef}
        data-motion
        className={`relative max-h-[calc(100dvh-32px)] w-[min(440px,100%)] overflow-y-auto rounded-xl border border-line px-6 pt-6 pb-[22px] modal-stagger shadow-[0_24px_60px_-20px_#000] transition-[opacity,scale,translate] duration-[420ms] ease-[var(--ease-out-expo)] starting:translate-y-4 starting:scale-[0.94] starting:opacity-0 ${
          closing ? "scale-[0.97] opacity-0 duration-150! ease-out!" : ""
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="parish-modal-title"
        onClick={(e) => e.stopPropagation()}
        onTransitionEnd={(e) => {
          if (closing && e.target === e.currentTarget && e.propertyName === "opacity") onClose();
        }}
        style={{
          // La zona tiñe suavemente la parte superior del fondo en vez de un borde grueso
          // de color, que chocaba con las esquinas redondeadas
          background: `linear-gradient(180deg, ${color}26, transparent 150px), var(--color-panel-2)`,
        }}
      >
        <button
          ref={closeRef}
          className="absolute top-2.5 right-3 grid h-8 w-8 cursor-pointer place-items-center rounded-full border border-line bg-panel p-0 text-fg-dim transition-[color,border-color,scale,rotate] duration-150 ease-out hover:border-caritas-soft hover:text-fg active:scale-[0.92] hover:rotate-90 focus-visible:border-caritas-soft focus-visible:text-fg"
          onClick={requestClose}
          aria-label="Cerrar"
        >
          <svg className="h-3 w-3" viewBox="0 0 12 12" aria-hidden="true">
            <path
              d="M1.5 1.5l9 9m0-9l-9 9"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="flex flex-wrap items-center gap-2 pr-10" style={{ "--i": 1 }}>
          <ZonePill zone={parish.zone}>Zona {parish.zone}</ZonePill>
          {parish.zeroZone && <ZeroZoneTag full className="py-[3px] text-[11px]" />}
        </div>

        <h3 id="parish-modal-title" className="mt-3.5 mb-3 text-[22px] text-fg" style={{ "--i": 2 }}>
          {parish.name}
        </h3>
        {parish.zeroZone && (
          // La etiqueta sola no dice qué significa: quien llega desde el mapa no vio la leyenda
          <p className="-mt-1.5 mb-3 text-[13px] text-fg-dim" style={{ "--i": 2 }}>
            Una de las parroquias con mayor devastación tras el doblete sísmico.
          </p>
        )}

        <div
          className="text-[44px] font-semibold leading-[1.05] tracking-[-0.04em] text-fg tabular-nums"
          style={{ "--i": 3 }}
        >
          {fmt(parish.tons)}
          <span className="ml-1.5 text-[15px] font-medium tracking-normal text-fg-dim">
            toneladas
          </span>
        </div>
        <div className="mt-1.5 text-[13px] text-fg-dim" style={{ "--i": 4 }}>
          <TruckIcon className="mr-[7px] inline-block h-[17px] w-[17px] align-[-3px] text-white" />
          {parish.vehicles} vehículos despachados
        </div>

        {(parish.priest || parish.address) && (
          <dl
            className="mt-[18px] mb-0 grid gap-3 border-t border-line pt-3.5"
            style={{ "--i": 5 }}
          >
            {parish.priest && (
              <div>
                <dt className="mb-0.5 text-[11px] font-bold uppercase tracking-[0.06em] text-fg-dim">
                  Presbítero
                </dt>
                <dd className="m-0 text-[14px] leading-[1.45] text-fg">{parish.priest}</dd>
              </div>
            )}
            {parish.address && (
              <div>
                <dt className="mb-0.5 text-[11px] font-bold uppercase tracking-[0.06em] text-fg-dim">
                  Dirección
                </dt>
                <dd className="m-0 text-[14px] leading-[1.45] text-fg">{parish.address}</dd>
              </div>
            )}
          </dl>
        )}
      </div>
    </div>
  );
}
