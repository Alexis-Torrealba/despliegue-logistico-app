import { ZONE_COLORS } from "../data/parishes.js";

export default function ZonePill({ zone, children }) {
  const color = ZONE_COLORS[zone];
  return (
    <span
      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-[9px] py-[3px] text-[11.5px] font-semibold"
      style={{ background: `${color}1f`, color, border: `1px solid ${color}44` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }}></span>
      {children ?? zone}
    </span>
  );
}
