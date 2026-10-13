import { useEffect, useRef, useState } from "react";

// true la primera vez que el elemento entra en pantalla, y se queda así: las cifras y
// barras se animan una sola vez y luego se quedan quietas mientras se leen
export function useInView({ margin = "0px 0px -6% 0px" } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    if (!("IntersectionObserver" in window)) return setInView(true);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [inView, margin]);

  return [ref, inView];
}

export const prefersReducedMotion = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
