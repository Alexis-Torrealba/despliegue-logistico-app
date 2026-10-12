import { useEffect, useRef } from "react";
import { ZONE_COLORS } from "../data/parishes.js";
import { fmt } from "../utils/format.js";
import TruckIcon from "./TruckIcon.jsx";

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
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="parish-modal-title"
        onClick={(e) => e.stopPropagation()}
        style={{ borderTopColor: color }}
      >
        <button ref={closeRef} className="modal__close" onClick={onClose} aria-label="Cerrar">
          ×
        </button>

        <span
          className="zone-pill"
          style={{
            background: `${color}1f`,
            color,
            border: `1px solid ${color}44`,
          }}
        >
          <span className="d" style={{ background: color }}></span>
          Zona {parish.zone}
        </span>

        <h3 id="parish-modal-title" className="modal__title">
          {parish.name}
        </h3>

        <div className="modal__tons">
          {fmt(parish.tons)}
          <span> toneladas</span>
        </div>
        <div className="modal__sub">
          <TruckIcon />
          {parish.vehicles} vehículos despachados
        </div>

        {(parish.priest || parish.address) && (
          <dl className="modal__info">
            {parish.priest && (
              <div>
                <dt>Presbítero</dt>
                <dd>{parish.priest}</dd>
              </div>
            )}
            {parish.address && (
              <div>
                <dt>Dirección</dt>
                <dd>{parish.address}</dd>
              </div>
            )}
          </dl>
        )}
      </div>
    </div>
  );
}
