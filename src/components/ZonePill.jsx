import { ZONE_COLORS } from "../data/parishes.js";

export default function ZonePill({ zone, children }) {
  const color = ZONE_COLORS[zone];
  // El texto va aclarado con blanco: el color puro de zona no llega a 4,5:1 sobre el panel
  return (
    <span
      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-[4px] px-[9px] py-[3px] text-[11.5px] font-semibold"
      style={{
        background: `${color}1f`,
        color: `color-mix(in srgb, ${color} 60%, white)`,
        border: `1px solid ${color}44`,
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }}></span>
      {children ?? zone}
    </span>
  );
}
