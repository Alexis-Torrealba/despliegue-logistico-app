import Card from "./Card.jsx";
import Doughnut from "./Doughnut.jsx";
import { Legend, LegendItem } from "./Legend.jsx";
import { DONORS, DONOR_COLORS } from "../data/donors.js";
import { TOTAL_TONS } from "../data/parishes.js";
import { fmt } from "../utils/format.js";

export default function DonorsCard() {
  return (
    <Card
      id="donantes"
      title="Fuentes de donación"
      desc={`Origen del volumen consolidado (${fmt(TOTAL_TONS)} t)`}
    >
      <div className="flex flex-col items-stretch gap-[22px]">
        <div className="flex justify-center">
          <Doughnut
            labels={DONORS.map((d) => d.name)}
            data={DONORS.map((d) => d.tons)}
            colors={DONOR_COLORS}
            centerLabel="Donantes"
            centerValue={DONORS.length}
          />
        </div>
        <Legend className="mt-3.5">
          {DONORS.map((d, i) => (
            <LegendItem key={d.name} color={DONOR_COLORS[i]} value={`${fmt(d.tons)} t`}>
              {d.name} <span className="text-fg-dim">· {d.note}</span>
            </LegendItem>
          ))}
        </Legend>
      </div>
    </Card>
  );
}
