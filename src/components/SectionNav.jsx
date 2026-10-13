import { useEffect, useState } from "react";
import { useClipIndicator } from "../hooks/useClipIndicator.js";
import { prefersReducedMotion } from "../hooks/useInView.js";

const SECTIONS = [
  { id: "resumen", label: "Resumen" },
  { id: "donantes", label: "Donantes" },
  { id: "top", label: "Top parroquias" },
  { id: "mapa", label: "Mapa" },
  { id: "detalle", label: "Desglose" },
];

// Altura de la barra fija más un margen: una sección cuenta como actual al llegar ahí
const ACTIVE_OFFSET = 120;

const link =
  "inline-flex shrink-0 items-center whitespace-nowrap rounded-md border px-[13px] py-[7px] mobile:min-h-11 mobile:px-3.5 text-[12.5px] font-semibold no-underline transition-[color,background-color,border-color,scale] duration-150 ease-out active:scale-[0.97]";

const ROW = "m-0 flex list-none items-center gap-2 p-0";

// Barra fija que solo lleva a cada sección y marca en cuál estás. En pantallas
// estrechas se desliza en horizontal; el borde derecho se desvanece para insinuarlo
export default function SectionNav() {
  const [current, setCurrent] = useState(null);
  const [overflowing, setOverflowing] = useState({ start: false, end: false });
  const [wrapRef, overlayStyle] = useClipIndicator(SECTIONS.findIndex((s) => s.id === current));

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let active = null;
      let activeTop = -Infinity;
      for (const { id } of SECTIONS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const { top } = el.getBoundingClientRect();
        // En escritorio Donantes está al lado de Resumen (mismo top): gana la primera
        if (top <= ACTIVE_OFFSET && top > activeTop + 1) {
          active = id;
          activeTop = top;
        }
      }
      setCurrent(active);
    };
    const onScroll = () => frame || (frame = requestAnimationFrame(update));
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const measure = (el) => {
    if (!el) return;
    const start = el.scrollLeft > 4;
    const end = el.scrollLeft + el.clientWidth < el.scrollWidth - 4;
    setOverflowing((o) => (o.start === start && o.end === end ? o : { start, end }));
  };

  useEffect(() => {
    const el = document.getElementById("section-nav-list");
    const onResize = () => measure(el);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // En pantallas estrechas la fila se desplaza sola para que la sección actual se vea
  useEffect(() => {
    const list = document.getElementById("section-nav-list");
    const link = list?.querySelector(`a[href="#${current}"]`);
    if (!link || list.scrollWidth <= list.clientWidth) return;
    const left = link.offsetLeft - (list.clientWidth - link.offsetWidth) / 2;
    list.scrollTo({ left, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, [current]);

  const mask = `linear-gradient(to right, ${overflowing.start ? "transparent, black 28px" : "black"}, ${
    overflowing.end ? "black calc(100% - 28px), transparent" : "black"
  })`;

  return (
    <nav
      className="sticky top-[env(safe-area-inset-top,0px)] z-40 mb-[26px] rounded-lg border border-line bg-[rgba(18,16,14,0.88)] px-2.5 py-[9px] backdrop-blur-[10px]"
      aria-label="Secciones del informe"
    >
      <div
        id="section-nav-list"
        className="overflow-x-auto [&::-webkit-scrollbar]:hidden"
        style={{ maskImage: mask, WebkitMaskImage: mask, scrollbarWidth: "none" }}
        onScroll={(e) => measure(e.currentTarget)}
      >
        {/* La fila real lleva los enlaces; la copia de encima, recortada a la sección
            actual, es el indicador que se desliza al avanzar por la página */}
        <div ref={wrapRef} className="relative w-max min-w-full">
          <ul className={ROW}>
            {SECTIONS.map(({ id, label }) => (
              <li key={id} className="shrink-0">
                <a
                  href={`#${id}`}
                  data-tab
                  aria-current={current === id ? "location" : undefined}
                  className={`${link} border-line bg-panel-2 text-fg-dim hover:border-caritas-soft hover:text-fg`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <ul className={`${ROW} pointer-events-none absolute inset-0`} style={overlayStyle} aria-hidden="true">
            {SECTIONS.map(({ id, label }) => (
              <li key={id} className="shrink-0">
                <span className={`${link} border-caritas bg-caritas text-white`}>{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Avance de lectura de toda la página */}
      <div
        className="read-progress pointer-events-none absolute inset-x-3 -bottom-px h-px bg-caritas-soft/70"
        aria-hidden="true"
      ></div>
    </nav>
  );
}
