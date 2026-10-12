// Leyenda de los gráficos de dona
export function Legend({ className = "", children }) {
  return (
    <div className={`flex min-w-[180px] flex-1 flex-col gap-[9px] ${className}`}>{children}</div>
  );
}

export function LegendItem({ color, children, value }) {
  return (
    <div className="flex items-center gap-2.5 text-[13.5px]">
      <span className="h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ background: color }}></span>
      <span className="flex-1 text-fg">{children}</span>
      <span className="text-[13px] text-fg-dim tabular-nums">{value}</span>
    </div>
  );
}
