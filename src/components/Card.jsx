// Tarjeta del informe: panel con título y descripción opcional
export default function Card({ id, title, desc, className = "", children }) {
  return (
    <div
      id={id}
      className={`min-w-0 rounded-2xl border border-line bg-panel p-5.5 shadow-[0_12px_30px_-18px_#000000b3] ${className}`}
    >
      <h2 className="mt-0 mb-1 text-[20px]">{title}</h2>
      {desc && <div className="mb-4 text-[13px] text-fg-dim">{desc}</div>}
      {children}
    </div>
  );
}
