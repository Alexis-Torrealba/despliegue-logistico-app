import { useCallback, useEffect, useRef, useState } from "react";
import mapaCompleto from "../assets/maps/mapa-completo.svg?raw";
import mapaEste from "../assets/maps/mapa-zona-este.svg?raw";
import mapaCentro from "../assets/maps/mapa-zona-centro.svg?raw";
import mapaCatia from "../assets/maps/mapa-zona-catia-la-mar.svg?raw";
import mapaMontana from "../assets/maps/mapa-zona-montana.svg?raw";
import { PARISH_BY_MAP_ID } from "../data/parishes.js";
import ParishModal from "./ParishModal.jsx";

const MAPS = [
  { label: "Mapa completo", svg: mapaCompleto },
  { label: "Zona Este", svg: mapaEste },
  { label: "Zona Centro", svg: mapaCentro },
  { label: "Zona Catia La Mar", svg: mapaCatia },
  { label: "Zona Montaña", svg: mapaMontana },
];

const SVG_NS = "http://www.w3.org/2000/svg";

// Devuelve el data-id de la parroquia bajo el elemento (región o marcador),
// solo si esa parroquia tiene datos en el desglose
function parishIdOf(el) {
  const target = el.closest?.(".parroquia, [data-parroquia]");
  if (!target) return null;
  const id = target.dataset.parroquia ?? target.dataset.id;
  return PARISH_BY_MAP_ID[id] ? id : null;
}

// Centro de la superficie y zoom de cada parroquia. El zoom se limita según el grosor
// real de la forma: en franjas largas y curvas (Vista al Mar) escalar desde el centro
// la desplazaría respecto a la original, así que crecen menos
function zoomGeometry(svg, path) {
  const b = path.getBBox();
  const q = svg.createSVGPoint();
  const N = 24;
  let sx = 0, sy = 0, n = 0;
  for (let i = 0; i < N; i++)
    for (let j = 0; j < N; j++) {
      q.x = b.x + (b.width * (i + 0.5)) / N;
      q.y = b.y + (b.height * (j + 0.5)) / N;
      if (path.isPointInFill(q)) {
        sx += q.x;
        sy += q.y;
        n++;
      }
    }
  if (!n) return { cx: b.x + b.width / 2, cy: b.y + b.height / 2, scale: 1.07 };
  const area = (n * b.width * b.height) / (N * N);
  const thickness = (2 * area) / path.getTotalLength();
  const halfDiag = Math.hypot(b.width, b.height) / 2;
  return { cx: sx / n, cy: sy / n, scale: 1 + Math.min(0.07, (0.12 * thickness) / halfDiag) };
}

// Recorta el viewBox al dibujo (sin títulos ni etiquetas de parroquia) para que
// todos los mapas llenen el mismo marco. Devuelve el recorte como vista base del zoom
function fitViewBox(svg) {
  const parts = svg.querySelectorAll(
    '[id$="-parroquias"], [id$="-marcadores"], .etiqueta:not([data-parroquia])'
  );
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  parts.forEach((el) => {
    const b = el.getBBox();
    if (!b.width) return;
    x0 = Math.min(x0, b.x);
    y0 = Math.min(y0, b.y);
    x1 = Math.max(x1, b.x + b.width);
    y1 = Math.max(y1, b.y + b.height);
  });
  const pad = Math.max(x1 - x0, y1 - y0) * 0.03;
  const w = x1 - x0 + pad * 2, h = y1 - y0 + pad * 2;
  svg.setAttribute("viewBox", `${x0 - pad} ${y0 - pad} ${w} ${h}`);
  // width/height dan la proporción natural que usa el móvil; deben coincidir con el recorte
  svg.setAttribute("width", w);
  svg.setAttribute("height", h);
  return { x: x0 - pad, y: y0 - pad, w, h };
}

const MAX_ZOOM = 6;

// Acercar y mover el mapa cambiando su viewBox: botones, pellizco con dos dedos y
// arrastre con uno. Pensado para móvil, donde el mapa completo queda muy pequeño
function attachPanZoom(svg, base, onZoomChange) {
  const view = { ...base };
  const apply = () => svg.setAttribute("viewBox", `${view.x} ${view.y} ${view.w} ${view.h}`);
  const clamp = () => {
    view.x = Math.min(Math.max(view.x, base.x), base.x + base.w - view.w);
    view.y = Math.min(Math.max(view.y, base.y), base.y + base.h - view.h);
  };
  let zoomed = false;
  const zoomAt = (factor, ux, uy) => {
    const w = Math.min(Math.max(view.w / factor, base.w / MAX_ZOOM), base.w);
    const f = w / view.w;
    view.x = ux - (ux - view.x) * f;
    view.y = uy - (uy - view.y) * f;
    view.w = w;
    view.h *= f;
    clamp();
    apply();
    const now = view.w < base.w - 0.5;
    if (now !== zoomed) onZoomChange((zoomed = now));
  };
  const toUser = (clientX, clientY) => {
    const p = svg.createSVGPoint();
    p.x = clientX;
    p.y = clientY;
    return p.matrixTransform(svg.getScreenCTM().inverse());
  };

  const pointers = new Map();
  let dragged = false;
  let pinch = null;
  let start = null;
  const onDown = (e) => {
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 1) {
      dragged = false;
      start = { x: e.clientX, y: e.clientY };
    }
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      pinch = { dist: Math.hypot(a.x - b.x, a.y - b.y) };
    }
  };
  const onMove = (e) => {
    const prev = pointers.get(e.pointerId);
    if (!prev) return;
    const cur = { x: e.clientX, y: e.clientY };
    if (pointers.size === 2 && pinch) {
      pointers.set(e.pointerId, cur);
      const [a, b] = [...pointers.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const mid = toUser((a.x + b.x) / 2, (a.y + b.y) / 2);
      zoomAt(dist / pinch.dist, mid.x, mid.y);
      pinch.dist = dist;
      dragged = true;
    } else if (pointers.size === 1 && zoomed) {
      const p0 = toUser(prev.x, prev.y), p1 = toUser(cur.x, cur.y);
      view.x -= p1.x - p0.x;
      view.y -= p1.y - p0.y;
      clamp();
      apply();
      pointers.set(e.pointerId, cur);
      if (Math.hypot(cur.x - start.x, cur.y - start.y) > 6) dragged = true;
    }
  };
  const onUp = (e) => {
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinch = null;
  };
  svg.addEventListener("pointerdown", onDown);
  svg.addEventListener("pointermove", onMove);
  svg.addEventListener("pointerup", onUp);
  svg.addEventListener("pointercancel", onUp);

  const center = () => ({ x: view.x + view.w / 2, y: view.y + view.h / 2 });
  return {
    zoomBy: (factor) => {
      const c = center();
      zoomAt(factor, c.x, c.y);
    },
    reset: () => zoomAt(0, 0, 0),
    // tras arrastrar o pellizcar, el clic que dispara el navegador no debe abrir el modal
    wasDragged: () => dragged,
    destroy: () => {
      svg.removeEventListener("pointerdown", onDown);
      svg.removeEventListener("pointermove", onMove);
      svg.removeEventListener("pointerup", onUp);
      svg.removeEventListener("pointercancel", onUp);
    },
  };
}

export default function MapCard() {
  const mapRef = useRef(null);
  const tipRef = useRef(null);
  const panZoomRef = useRef(null);
  const [active, setActive] = useState(MAPS[0].label);
  const [selected, setSelected] = useState(null);
  const [zoomed, setZoomed] = useState(false);
  const [chips, setChips] = useState([]);
  const closeModal = useCallback(() => setSelected(null), []);
  const map = MAPS.find((m) => m.label === active);

  useEffect(() => {
    const root = mapRef.current;
    const tip = tipRef.current;
    const svg = root.querySelector("svg");
    const group = root.querySelector('[id$="-parroquias"]');
    const panZoom = attachPanZoom(svg, fitViewBox(svg), setZoomed);
    panZoomRef.current = panZoom;
    setZoomed(false);

    // Copia de la región resaltada, dibujada encima de las vecinas para que el zoom no quede tapado.
    // El grosor del borde se ajusta a la escala de cada mapa
    const highlight = document.createElementNS(SVG_NS, "use");
    highlight.setAttribute("class", "map-highlight");
    const unit = svg.viewBox.baseVal.width / 430;
    highlight.style.strokeWidth = unit;
    highlight.style.setProperty("--map-glow", `${unit * 1.5}px`);
    group.appendChild(highlight);

    group.querySelectorAll(".parroquia").forEach((path) => {
      path.querySelector("title")?.remove(); // el nombre lo muestra el tooltip
      const parish = PARISH_BY_MAP_ID[path.dataset.id];
      if (!parish) {
        // estilo en línea para ganarle al :hover que trae el propio SVG
        path.style.cursor = "default";
        path.style.filter = "none";
        return;
      }
      path.setAttribute("tabindex", "0");
      path.setAttribute("role", "button");
      path.setAttribute("aria-label", `${path.dataset.nombre}: ver toneladas`);
    });
    setChips(
      [...group.querySelectorAll(".parroquia")]
        .filter((p) => PARISH_BY_MAP_ID[p.dataset.id])
        .map((p) => ({ id: p.dataset.id, nombre: p.dataset.nombre }))
        .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"))
    );

    const placeTip = (clientX, clientY) => {
      const r = tip.parentElement.getBoundingClientRect();
      tip.style.left = `${clientX - r.left}px`;
      tip.style.top = `${clientY - r.top}px`;
      tip.classList.toggle("below", clientY - r.top < 50); // sin espacio arriba, va debajo del cursor
    };

    const zooms = new Map(); // se calcula al primer hover de cada parroquia
    let current = null;
    const show = (id) => {
      if (id === current) return;
      current = id;
      highlight.classList.remove("visible");
      tip.classList.remove("visible");
      group.querySelector(".map-hovered")?.classList.remove("map-hovered");
      if (!id) return;
      const path = group.querySelector(`.parroquia[data-id="${id}"]`);
      if (!zooms.has(id)) zooms.set(id, zoomGeometry(svg, path));
      const { cx, cy, scale } = zooms.get(id);
      path.classList.add("map-hovered");
      highlight.setAttribute("href", `#${path.id}`);
      highlight.style.setProperty("--map-scale", scale);
      highlight.style.transformOrigin = `${cx}px ${cy}px`;
      highlight.getBoundingClientRect(); // reinicia la animación de zoom
      highlight.classList.add("visible");
      tip.textContent = path.dataset.nombre;
      tip.classList.add("visible");
    };
    const open = (id) => id && setSelected(PARISH_BY_MAP_ID[id]);

    const onOver = (e) => show(parishIdOf(e.target));
    const onMove = (e) => current && placeTip(e.clientX, e.clientY);
    const onLeave = () => show(null);
    const onFocus = (e) => {
      show(parishIdOf(e.target));
      if (!current) return;
      const r = e.target.getBoundingClientRect();
      placeTip(r.left + r.width / 2, r.top + r.height / 2);
    };
    const onClick = (e) => !panZoom.wasDragged() && open(parishIdOf(e.target));
    const onKey = (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const id = parishIdOf(e.target);
      if (id) {
        e.preventDefault();
        open(id);
      }
    };

    root.addEventListener("mouseover", onOver);
    root.addEventListener("mousemove", onMove);
    root.addEventListener("mouseleave", onLeave);
    root.addEventListener("focusin", onFocus);
    root.addEventListener("focusout", onLeave);
    root.addEventListener("click", onClick);
    root.addEventListener("keydown", onKey);
    return () => {
      root.removeEventListener("mouseover", onOver);
      root.removeEventListener("mousemove", onMove);
      root.removeEventListener("mouseleave", onLeave);
      root.removeEventListener("focusin", onFocus);
      root.removeEventListener("focusout", onLeave);
      root.removeEventListener("click", onClick);
      root.removeEventListener("keydown", onKey);
      highlight.remove();
      tip.classList.remove("visible");
      panZoom.destroy();
    };
  }, [active]);

  return (
    <div id="mapa" className="card" style={{ marginBottom: 18 }}>
      <h2>Mapa de parroquias</h2>
      <div className="desc">
        <span className="map-desc-desktop">
          Pasa el cursor sobre una parroquia y haz clic para ver las toneladas recibidas
        </span>
        <span className="map-desc-mobile">
          Toca una parroquia para ver sus toneladas. Pellizca o usa + para acercar y arrastra
          para moverte
        </span>
      </div>

      <div className="tabs" role="tablist" aria-label="Mapas por zona">
        {MAPS.map((m) => (
          <button
            key={m.label}
            type="button"
            role="tab"
            aria-selected={active === m.label}
            className={`tab ${active === m.label ? "active" : ""}`}
            onClick={() => setActive(m.label)}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="map-scroll">
        <div className={`map-frame ${zoomed ? "zoomed" : ""}`}>
          <div
            key={active}
            ref={mapRef}
            className="map-svg"
            dangerouslySetInnerHTML={{ __html: map.svg }}
          />
          <div ref={tipRef} className="map-tip" aria-hidden="true"></div>
        </div>
      </div>
      <div className="map-zoom" role="group" aria-label="Zoom del mapa">
        <button type="button" aria-label="Alejar" onClick={() => panZoomRef.current.zoomBy(1 / 1.6)}>
          −
        </button>
        <button type="button" aria-label="Acercar" onClick={() => panZoomRef.current.zoomBy(1.6)}>
          +
        </button>
        <button
          type="button"
          aria-label="Ver mapa entero"
          disabled={!zoomed}
          onClick={() => panZoomRef.current.reset()}
        >
          ⤢
        </button>
      </div>
      {active !== MAPS[0].label && (
        <div className="map-chips" aria-label="Parroquias de la zona">
          {chips.map((c) => (
            <button
              key={c.id}
              type="button"
              className="map-chip"
              onClick={() => setSelected(PARISH_BY_MAP_ID[c.id])}
            >
              {c.nombre}
            </button>
          ))}
        </div>
      )}
      {selected && <ParishModal parish={selected} onClose={closeModal} />}
    </div>
  );
}
