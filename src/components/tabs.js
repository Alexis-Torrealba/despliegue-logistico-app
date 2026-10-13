// Pestañas de esquinas rectas (mapa y desglose). La activa no reacciona al hover

export function tabClass(active) {
  const base =
    "cursor-pointer select-none rounded-md border px-3.5 py-2 mobile:min-h-11 font-[inherit] text-[13px] font-semibold transition-[color,background-color,border-color,scale] duration-150 ease-out active:scale-[0.97]";
  return active
    ? `${base} border-caritas bg-caritas text-white`
    : `${base} border-line bg-panel-2 text-fg-dim hover:border-caritas-soft hover:text-fg`;
}
