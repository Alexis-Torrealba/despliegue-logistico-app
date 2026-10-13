import { useLayoutEffect, useRef, useState } from "react";

// Indicador de pestaña activa hecho con una copia de la fila en su estilo activo,
// recortada con clip-path a la pestaña elegida. Al cambiar, el recorte viaja hasta la
// nueva: el color del fondo y del texto cambian a la vez y sin mezclas, cosa que no se
// consigue animando cada botón por separado.
// Devuelve la ref del contenedor (position: relative) y el estilo de la copia
export function useClipIndicator(activeIndex) {
  const wrapRef = useRef(null);
  const [clip, setClip] = useState(null);
  const ready = useRef(false);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const measure = () => {
      const items = wrap.querySelectorAll("[data-tab]");
      const el = items[activeIndex];
      const W = wrap.offsetWidth;
      const H = wrap.offsetHeight;
      if (!el) {
        // Sin pestaña activa: se pliega sobre el borde izquierdo de la primera
        const first = items[0];
        const left = first ? first.offsetLeft : 0;
        const top = first ? first.offsetTop : 0;
        const h = first ? first.offsetHeight : H;
        setClip({ value: `inset(${top}px ${W - left}px ${H - top - h}px ${left}px round 6px)`, on: false });
        return;
      }
      const { offsetLeft: l, offsetTop: t, offsetWidth: w, offsetHeight: h } = el;
      setClip({
        value: `inset(${t}px ${W - l - w}px ${H - t - h}px ${l}px round 6px)`,
        on: true,
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [activeIndex]);

  // La primera medida se aplica sin transición: el indicador no debe llegar volando al cargar
  useLayoutEffect(() => {
    if (!clip || ready.current) return;
    const id = requestAnimationFrame(() => (ready.current = true));
    return () => cancelAnimationFrame(id);
  }, [clip]);

  const overlayStyle = {
    clipPath: clip?.value ?? "inset(0 100% 0 0)",
    opacity: clip?.on ? 1 : 0,
    transition: ready.current
      ? "clip-path 380ms var(--ease-out), opacity 200ms ease"
      : "none",
  };

  return [wrapRef, overlayStyle];
}
