import { createContext, useContext } from "react";
import { useInView } from "../hooks/useInView.js";

// Dice a lo que va dentro (cifras, barras, donas) si la tarjeta ya entró en pantalla
const RevealContext = createContext(true);
export const useRevealed = () => useContext(RevealContext);

// Tarjeta del informe: panel con título y descripción opcional. Entra una vez al
// llegar a pantalla y entonces arranca la animación de su contenido
export default function Card({ id, title, desc, className = "", children }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      id={id}
      data-reveal={inView ? "in" : "out"}
      className={`min-w-0 rounded-xl border border-line bg-panel p-5.5 shadow-[0_14px_32px_-20px_rgba(40,14,8,0.85)] ${className}`}
    >
      <h2 className="mt-0 mb-1 text-[20px]">{title}</h2>
      {desc && <div className="mb-4 text-[13px] text-fg-dim">{desc}</div>}
      <RevealContext.Provider value={inView}>{children}</RevealContext.Provider>
    </div>
  );
}
