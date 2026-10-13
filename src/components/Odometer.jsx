import { useEffect, useRef, useState } from "react";
import { fmt } from "../utils/format.js";

// Cada dígito es una tira 0–9 repetida dos veces: al entrar en pantalla rueda desde 0
// pasando por la primera vuelta y se detiene en la segunda, como un contador mecánico
const STRIP = [..."01234567890123456789"];

// Cifra que rueda hasta su valor. El texto real queda en el flujo (transparente) para
// dar el ancho, la línea base y lo que leen los lectores de pantalla y el portapapeles;
// las tiras van encima, solo visuales
export default function Odometer({ value, format = fmt, active = true, className = "" }) {
  const text = format(value);
  const chars = [...text];
  // La primera vez rueda lento y en cascada; al cambiar de valor después (otra parroquia
  // en el modal, otra zona en la dona), más rápido: ya no es una presentación
  const settled = useRef(false);
  const first = !settled.current;
  // Se pinta una vez en 0 antes de apuntar al valor: sin eso, lo que ya llega activo
  // (el modal) aparecería quieto en su cifra final
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    let f2;
    const f1 = requestAnimationFrame(() => (f2 = requestAnimationFrame(() => setArmed(true))));
    return () => {
      cancelAnimationFrame(f1);
      cancelAnimationFrame(f2);
    };
  }, []);
  const rolling = active && armed;
  useEffect(() => {
    if (rolling) settled.current = true;
  }, [rolling]);

  return (
    <span className={`odo relative inline-block whitespace-nowrap ${className}`}>
      <span className="text-transparent">{text}</span>
      <span className="absolute inset-0 flex" aria-hidden="true">
        {chars.map((ch, i) => {
          // Clave desde la derecha: 50 → 120 conserva las unidades y suma una columna
          const key = chars.length - i;
          if (!/\d/.test(ch)) return <span key={`s${key}`}>{ch}</span>;
          const target = rolling ? 10 + Number(ch) : 0;
          return (
            <span key={key} className="relative inline-block overflow-hidden">
              <span className="text-transparent">{ch}</span>
              <span
                className="odo-strip absolute inset-x-0 top-0 flex flex-col"
                style={{
                  transform: `translateY(${(-target * 100) / STRIP.length}%)`,
                  transitionDuration: first ? "1300ms" : "650ms",
                  transitionDelay: first ? `${i * 55}ms` : `${i * 18}ms`,
                }}
              >
                {STRIP.map((d, j) => (
                  <span key={j}>{d}</span>
                ))}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
