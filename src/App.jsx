import { useState } from "react";
import Header from "./components/Header.jsx";
import ZoneDistributionCard from "./components/ZoneDistributionCard.jsx";
import DonorsCard from "./components/DonorsCard.jsx";
import TopParishesCard from "./components/TopParishesCard.jsx";
import ParishTable from "./components/ParishTable.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  const [zoneFilter, setZoneFilter] = useState("Todas");

  return (
    <div className="wrap">
      <Header zoneFilter={zoneFilter} setZoneFilter={setZoneFilter} />

      <div id="resumen" className="grid">
        <ZoneDistributionCard />
        <DonorsCard />
      </div>

      <TopParishesCard />

      <ParishTable zoneFilter={zoneFilter} setZoneFilter={setZoneFilter} />

      <Footer />
    </div>
  );
}
