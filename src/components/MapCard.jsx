import { useEffect, useRef, useState } from "react";
import mapaCompleto from "../assets/maps/mapa-completo.svg?raw";
import { PARISH_BY_MAP_ID } from "../data/parishes.js";
import Card from "./Card.jsx";
import SlidingTabs from "./SlidingTabs.jsx";
import { prefersReducedMotion } from "../hooks/useInView.js";
import { FINDER_INPUT_ID } from "./ParishFinder.jsx";

// Solo el mapa completo viaja con la página; los de zona se piden aparte (import
// dinámico) cuando el navegador está libre, o al elegir su pestaña si llega antes
const MAPS = [
  { label: "Mapa completo", svg: mapaCompleto },
  { label: "Zona Este", load: () => import("../assets/maps/mapa-zona-este.svg?raw") },
  { label: "Zona Centro", load: () => import("../assets/maps/mapa-zona-centro.svg?raw") },
  {
    label: "Zona Catia La Mar",
    load: () => import("../assets/maps/mapa-zona-catia-la-mar.svg?raw"),
  },
  { label: "Zona Montaña", load: () => import("../assets/maps/mapa-zona-montana.svg?raw") },
];

const svgCache = { [MAPS[0].label]: mapaCompleto };
function loadMap(m) {
  return svgCache[m.label]
    ? Promise.resolve(svgCache[m.label])
    : m.load().then((mod) => (svgCache[m.label] = mod.default));
}

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
  let sx = 0,
    sy = 0,
    n = 0;
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
    '[id$="-parroquias"], [id$="-marcadores"], .etiqueta:not([data-parroquia])',
  );
  let x0 = Infinity,
    y0 = Infinity,
    x1 = -Infinity,
    y1 = -Infinity;
  parts.forEach((el) => {
    const b = el.getBBox();
    if (!b.width) return;
    x0 = Math.min(x0, b.x);
    y0 = Math.min(y0, b.y);
    x1 = Math.max(x1, b.x + b.width);
    y1 = Math.max(y1, b.y + b.height);
  });
  const pad = Math.max(x1 - x0, y1 - y0) * 0.03;
  const w = x1 - x0 + pad * 2,
    h = y1 - y0 + pad * 2;
  svg.setAttribute("viewBox", `${x0 - pad} ${y0 - pad} ${w} ${h}`);
  // width/height dan la proporción natural que usa el móvil; deben coincidir con el recorte
  svg.setAttribute("width", w);
  svg.setAttribute("height", h);
  return { x: x0 - pad, y: y0 - pad, w, h };
}

// Puntos azules y cuadros rojos más pequeños, encogidos desde su centro. Se cambian sus
// atributos y no con CSS, porque los puntos traen un rotate() que el CSS descentraría
const MARKER_SCALE = 0.6;

function shrinkMarkers(svg) {
  svg.querySelectorAll(".marcador:not([data-encogido])").forEach((m) => {
    const k = MARKER_SCALE;
    if (m.tagName === "ellipse") {
      m.setAttribute("rx", m.rx.baseVal.value * k);
      m.setAttribute("ry", m.ry.baseVal.value * k);
    } else if (m.tagName === "rect") {
      const { x, y, width: w, height: h } = m.getBBox();
      m.setAttribute("x", x + (w * (1 - k)) / 2);
      m.setAttribute("y", y + (h * (1 - k)) / 2);
      m.setAttribute("width", w * k);
      m.setAttribute("height", h * k);
    }
    m.dataset.encogido = ""; // en StrictMode el efecto corre dos veces sobre el mismo SVG
  });
}

const MAX_ZOOM = 6;

const ZOOM_BUTTON =
  "grid h-9 w-9 mobile:h-11 mobile:w-11 cursor-pointer place-items-center rounded-md border border-line bg-[rgba(18,16,14,0.85)] p-0 text-fg transition-[border-color,scale] duration-150 ease-out hover:border-caritas-soft active:scale-[0.97] disabled:cursor-default disabled:opacity-35 disabled:hover:border-line disabled:active:scale-100";

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
  const syncZoomed = () => {
    const now = view.w < base.w - 0.5;
    if (now !== zoomed) onZoomChange((zoomed = now));
  };
  // Mueve `v` como si se ampliara `factor` veces alrededor del punto (ux, uy)
  const zoomView = (v, factor, ux, uy) => {
    const w = Math.min(Math.max(v.w / factor, base.w / MAX_ZOOM), base.w);
    const f = w / v.w;
    v.x = ux - (ux - v.x) * f;
    v.y = uy - (uy - v.y) * f;
    v.w = w;
    v.h *= f;
  };
  const zoomAt = (factor, ux, uy) => {
    stopTween();
    zoomView(view, factor, ux, uy);
    clamp();
    apply();
    syncZoomed();
  };

  // Los botones llevan el encuadre con una transición corta en vez de saltar: así se ve
  // hacia dónde se acercó. Pellizco y arrastre siguen al dedo sin retraso
  let tween = 0;
  let goal = null; // encuadre final de la transición en curso
  const stopTween = () => {
    cancelAnimationFrame(tween);
    tween = 0;
  };
  const tweenTo = (target) => {
    stopTween();
    if (prefersReducedMotion()) {
      Object.assign(view, target);
      apply();
      return syncZoomed();
    }
    goal = target;
    const from = { ...view };
    const t0 = performance.now();
    const D = 420;
    const step = (now) => {
      const t = Math.min((now - t0) / D, 1);
      const k = 1 - Math.pow(1 - t, 4); // salida fuerte: arranca rápido y se posa
      for (const key of ["x", "y", "w", "h"]) view[key] = from[key] + (target[key] - from[key]) * k;
      apply();
      if (t < 1) tween = requestAnimationFrame(step);
      else {
        tween = 0;
        syncZoomed();
      }
    };
    // El estado de zoom (cursor, botón de encuadre) cambia al arrancar, no al terminar
    const after = target.w < base.w - 0.5;
    if (after !== zoomed) onZoomChange((zoomed = after));
    tween = requestAnimationFrame(step);
  };
  const clampView = (v) => {
    v.x = Math.min(Math.max(v.x, base.x), base.x + base.w - v.w);
    v.y = Math.min(Math.max(v.y, base.y), base.y + base.h - v.h);
    return v;
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
    stopTween();
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
      const p0 = toUser(prev.x, prev.y),
        p1 = toUser(cur.x, cur.y);
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
  // Si la ventana pierde el foco a mitad de un arrastre (cambio de app, alerta del sistema),
  // nunca llega el pointerup: se olvidan los punteros para que el siguiente toque empiece limpio
  const onBlur = () => {
    pointers.clear();
    pinch = null;
  };
  svg.addEventListener("pointerdown", onDown);
  svg.addEventListener("pointermove", onMove);
  // en window: con el mouse se puede soltar el botón fuera del mapa
  window.addEventListener("pointerup", onUp);
  window.addEventListener("pointercancel", onUp);
  window.addEventListener("blur", onBlur);

  return {
    zoomBy: (factor) => {
      // Desde donde iba a terminar la transición en curso, para que dos clics seguidos sumen
      const target = { ...(tween ? goal : view) };
      const c = { x: target.x + target.w / 2, y: target.y + target.h / 2 };
      zoomView(target, factor, c.x, c.y);
      tweenTo(clampView(target));
    },
    reset: () => tweenTo({ ...base }),
    // tras arrastrar o pellizcar, el clic que dispara el navegador no debe abrir el modal
    wasDragged: () => dragged,
    destroy: () => {
      stopTween();
      svg.removeEventListener("pointerdown", onDown);
      svg.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("blur", onBlur);
    },
  };
}

export default function MapCard({ onSelectParish }) {
  const mapRef = useRef(null);
  const tipRef = useRef(null);
  const wipeRef = useRef(null);
  const panZoomRef = useRef(null);
  // Los listeners del SVG se montan una vez por mapa: leen la función actual desde la ref
  const onSelectRef = useRef(onSelectParish);
  onSelectRef.current = onSelectParish;
  const [active, setActive] = useState(MAPS[0].label);
  const [zoomed, setZoomed] = useState(false);
  const [chips, setChips] = useState([]);
  // Se lee de la caché en el mismo render del cambio de pestaña (sin un cuadro con el
  // mapa anterior); el estado solo fuerza el render cuando llega uno que faltaba
  const [, setLoadedCount] = useState(0);
  const svgText = svgCache[active] ?? null;
  // En escritorio el zoom solo hace falta en el mapa completo, donde las parroquias
  // del litoral quedan muy pequeñas; en móvil está en todos los mapas
  const desktopZoom = active === MAPS[0].label;

  // Precarga de los mapas de zona en un momento libre, para que cambiar de pestaña sea inmediato
  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((cb) => setTimeout(cb, 1500));
    const cancel = window.cancelIdleCallback ?? clearTimeout;
    const id = idle(() => MAPS.forEach((m) => loadMap(m).catch(() => {})));
    return () => cancel(id);
  }, []);

  useEffect(() => {
    if (svgCache[active]) return;
    let alive = true;
    loadMap(MAPS.find((m) => m.label === active)).then(() => alive && setLoadedCount((n) => n + 1));
    return () => {
      alive = false;
    };
  }, [active]);

  useEffect(() => {
    const root = mapRef.current;
    const tip = tipRef.current;
    if (!svgText) return; // el mapa de zona aún está llegando; la cortina lo tapa
    const svg = root.querySelector("svg");
    const group = root.querySelector('[id$="-parroquias"]');
    shrinkMarkers(svg);
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
      // Mismo nombre que en la tabla y el modal, no el data-nombre que trae el SVG
      path.setAttribute("aria-label", `${parish.name}: ver detalle`);
    });
    setChips(
      [...group.querySelectorAll(".parroquia")]
        .filter((p) => PARISH_BY_MAP_ID[p.dataset.id])
        .map((p) => ({ id: p.dataset.id, nombre: PARISH_BY_MAP_ID[p.dataset.id].name }))
        .sort((a, b) => a.nombre.localeCompare(b.nombre, "es")),
    );

    // El tooltip persigue al cursor con un poco de inercia en vez de ir pegado a él:
    // cada cuadro recorre parte de la distancia que le falta
    const tipPos = { x: 0, y: 0, tx: 0, ty: 0, frame: 0 };
    const drawTip = () => {
      tipPos.x += (tipPos.tx - tipPos.x) * 0.32;
      tipPos.y += (tipPos.ty - tipPos.y) * 0.32;
      if (Math.abs(tipPos.tx - tipPos.x) < 0.3 && Math.abs(tipPos.ty - tipPos.y) < 0.3) {
        tipPos.x = tipPos.tx;
        tipPos.y = tipPos.ty;
      }
      tip.style.translate = `${tipPos.x}px ${tipPos.y}px`;
      tipPos.frame =
        tipPos.x === tipPos.tx && tipPos.y === tipPos.ty ? 0 : requestAnimationFrame(drawTip);
    };
    const placeTip = (clientX, clientY, snap = false) => {
      const r = tip.parentElement.getBoundingClientRect();
      tipPos.tx = clientX - r.left;
      tipPos.ty = clientY - r.top;
      tip.classList.toggle("below", tipPos.ty < 50); // sin espacio arriba, va debajo del cursor
      if (snap || prefersReducedMotion()) {
        tipPos.x = tipPos.tx;
        tipPos.y = tipPos.ty;
      }
      if (!tipPos.frame) tipPos.frame = requestAnimationFrame(drawTip);
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
      tip.textContent = PARISH_BY_MAP_ID[id].name;
      tip.classList.add("visible");
    };
    const open = (id) => id && onSelectRef.current(PARISH_BY_MAP_ID[id]);

    const onOver = (e) => show(parishIdOf(e.target));
    // Al aparecer, el tooltip nace bajo el cursor; desde ahí lo sigue
    let fresh = true;
    const onMove = (e) => {
      if (!current) return (fresh = true);
      placeTip(e.clientX, e.clientY, fresh);
      fresh = false;
    };
    const onLeave = () => show(null);
    const onFocus = (e) => {
      show(parishIdOf(e.target));
      if (!current) return;
      const r = e.target.getBoundingClientRect();
      placeTip(r.left + r.width / 2, r.top + r.height / 2, true);
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

    // Al llegar a pantalla o cambiar de mapa, una cortina con borde difuminado se retira
    // de oeste a este, siguiendo la costa. Se mueve solo con transform sobre una capa
    // aparte: el mapa (con su sombra SVG, cara de redibujar) se pinta una vez y se queda quieto
    const wipe = wipeRef.current;
    const sweep = () => {
      if (prefersReducedMotion()) {
        wipe.style.visibility = "hidden";
        return;
      }
      wipe.style.visibility = "visible";
      wipe
        .animate([{ transform: "translateX(0)" }, { transform: "translateX(100%)" }], {
          duration: 950,
          easing: "cubic-bezier(0.65, 0, 0.35, 1)",
          fill: "forwards",
        })
        .finished.then(() => (wipe.style.visibility = "hidden"))
        .catch(() => {});
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        sweep();
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(root);

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
      io.disconnect();
      wipe.getAnimations().forEach((a) => a.cancel());
      wipe.style.visibility = "visible";
      cancelAnimationFrame(tipPos.frame);
      highlight.remove();
      tip.classList.remove("visible");
      panZoom.destroy();
    };
  }, [svgText]);

  return (
    <Card
      id="mapa"
      className="mb-4.5"
      title="Mapa de parroquias"
      desc={
        <>
          <span className="mobile:hidden">
            Pasa el cursor sobre una parroquia y haz clic para ver las toneladas recibidas
            {desktopZoom && ". Usa + para acercar y arrastra para moverte"}
          </span>
          <span className="hidden mobile:inline">
            Toca una parroquia para ver sus toneladas. Pellizca o usa + para acercar y arrastra para
            moverte
          </span>
        </>
      }
    >
      <SlidingTabs
        items={MAPS.map((m) => m.label)}
        active={active}
        onSelect={setActive}
        label="Mapas por zona"
      />

      <div className="overflow-x-auto rounded-xl border border-line bg-panel-2">
        {/* map-frame, zoomed, map-svg y map-tip son ganchos para los estilos del SVG en index.css */}
        <div
          className={`map-frame relative min-w-[640px] select-none mobile:min-w-0 ${zoomed ? "zoomed" : ""}`}
        >
          <div
            key={`${active}${svgText ? "" : "-cargando"}`}
            ref={mapRef}
            className="map-svg map-enter p-3 mobile:p-1.5"
            dangerouslySetInnerHTML={{ __html: svgText ?? "" }}
          />
          {/* El recorte va en un envoltorio propio: la cortina sale por la derecha sin
              ensanchar el área de scroll del marco */}
          <div className="pointer-events-none absolute inset-0 z-1 overflow-hidden" aria-hidden="true">
            <div ref={wipeRef} className="map-wipe"></div>
          </div>
          <div ref={tipRef} className="map-tip" aria-hidden="true"></div>
        </div>
      </div>
      <div
        className={`mt-2 justify-end gap-1.5 ${desktopZoom ? "flex" : "hidden mobile:flex"}`}
        role="group"
        aria-label="Zoom del mapa"
      >
        <button
          type="button"
          className={ZOOM_BUTTON}
          aria-label="Alejar"
          onClick={() => panZoomRef.current.zoomBy(1 / 1.6)}
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 12 12" aria-hidden="true">
            <path
              d="M2 6h8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          className={ZOOM_BUTTON}
          aria-label="Acercar"
          onClick={() => panZoomRef.current.zoomBy(1.6)}
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 12 12" aria-hidden="true">
            <path
              d="M2 6h8M6 2v8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          className={ZOOM_BUTTON}
          aria-label="Ver mapa entero"
          disabled={!zoomed}
          onClick={() => panZoomRef.current.reset()}
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 12 12" aria-hidden="true">
            <path
              d="M1.5 4.5v-3h3M7.5 1.5h3v3M10.5 7.5v3h-3M4.5 10.5h-3v-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      {active !== MAPS[0].label ? (
        <div
          className="mt-3 hidden flex-wrap gap-1.5 mobile:flex"
          aria-label="Parroquias de la zona"
        >
          {chips.map((c) => (
            <button
              key={c.id}
              type="button"
              className="min-h-11 cursor-pointer rounded-md border border-line bg-panel-2 px-3 py-2 font-sans text-[13px] font-semibold leading-[normal] text-fg-dim transition-[color,background-color,border-color,scale] duration-150 ease-out active:scale-[0.97] active:border-caritas active:bg-caritas active:text-white"
              onClick={() => onSelectParish(PARISH_BY_MAP_ID[c.id])}
            >
              {c.nombre}
            </button>
          ))}
        </div>
      ) : (
        // En el mapa completo las 26 parroquias como botones serían un muro de opciones:
        // en móvil se orienta hacia las zonas o el buscador de la cabecera
        <p className="mt-3 mb-0 hidden flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-fg-dim mobile:flex">
          Elige una zona arriba para ver sus parroquias, o
          <button
            type="button"
            className="min-h-11 cursor-pointer border-0 bg-transparent p-0 font-[inherit] text-[13px] font-semibold text-caritas-soft underline decoration-caritas-soft/50 underline-offset-4"
            onClick={() => {
              const input = document.getElementById(FINDER_INPUT_ID);
              input?.scrollIntoView({ behavior: "smooth", block: "center" });
              input?.focus({ preventScroll: true });
            }}
          >
            busca tu parroquia
          </button>
        </p>
      )}
    </Card>
  );
}
