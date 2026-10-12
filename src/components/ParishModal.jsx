import { useEffect, useRef } from "react";
import { ZONE_COLORS } from "../data/parishes.js";
import { fmt } from "../utils/format.js";
import TruckIcon from "./TruckIcon.jsx";
import ZonePill from "./ZonePill.jsx";

export default function ParishModal({ parish, onClose }) {
  const closeRef = useRef(null);
  const color = ZONE_COLORS[parish.zone];

  useEffect(() => {
    const previous = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-100 grid animate-modal-fade place-items-center bg-[rgba(10,8,7,0.72)] p-4 backdrop-blur-[4px]"
      onClick={onClose}
    >
      <div
        className="relative max-h-[calc(100vh-32px)] w-[min(440px,100%)] animate-modal-pop overflow-y-auto rounded-2xl border border-t-4 border-line bg-[linear-gradient(160deg,var(--color-panel-2),var(--color-panel))] px-6 pt-6 pb-[22px] shadow-[0_24px_60px_-20px_#000]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="parish-modal-title"
        onClick={(e) => e.stopPropagation()}
        style={{ borderTopColor: color }}
      >
        <button
          ref={closeRef}
          className="absolute top-2.5 right-3 grid h-8 w-8 cursor-pointer place-items-center rounded-full border border-line bg-panel p-0 text-fg-dim hover:border-caritas-soft hover:text-fg focus-visible:border-caritas-soft focus-visible:text-fg"
          onClick={onClose}
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

        <ZonePill zone={parish.zone}>Zona {parish.zone}</ZonePill>

        <h3 id="parish-modal-title" className="mt-3.5 mb-3 font-serif text-[22px] text-fg">
          {parish.name}
        </h3>

        <div className="font-serif text-[40px] font-bold leading-[1.1] text-fg tabular-nums">
          {fmt(parish.tons)}
          <span className="font-sans text-[15px] font-semibold text-fg-dim"> toneladas</span>
        </div>
        <div className="mt-1.5 text-[13px] text-fg-dim">
          <TruckIcon className="mr-[7px] inline-block h-[17px] w-[17px] align-[-3px] text-white" />
          {parish.vehicles} vehículos despachados
        </div>

        {(parish.priest || parish.address) && (
          <dl className="mt-[18px] mb-0 grid gap-3 border-t border-line pt-3.5">
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
