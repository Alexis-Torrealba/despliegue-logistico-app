// Pestañas tipo píldora (mapa y desglose). La activa no reacciona al hover
export const TABS_ROW = "mb-4 flex flex-wrap gap-2";

export function tabClass(active) {
  const base =
    "cursor-pointer select-none rounded-full border px-3.5 py-2 font-[inherit] text-[13px] font-semibold transition-all duration-150 ease-[ease]";
  return active
    ? `${base} border-caritas bg-caritas text-white`
    : `${base} border-line bg-panel-2 text-fg-dim hover:border-caritas-soft hover:text-fg`;
}
