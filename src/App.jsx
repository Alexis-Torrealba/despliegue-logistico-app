import { useState } from "react";
import SiteHeader from "./components/SiteHeader.jsx";
import Header from "./components/Header.jsx";
import ZoneDistributionCard from "./components/ZoneDistributionCard.jsx";
import DonorsCard from "./components/DonorsCard.jsx";
import TopParishesCard from "./components/TopParishesCard.jsx";
import ParishTable from "./components/ParishTable.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  const [zoneFilter, setZoneFilter] = useState("Todas");

  return (
    <>
      <SiteHeader />

      <main className="wrap">
        <Header zoneFilter={zoneFilter} setZoneFilter={setZoneFilter} />

        <div id="resumen" className="grid">
          <ZoneDistributionCard />
          <DonorsCard />
        </div>

        <TopParishesCard />

        <ParishTable zoneFilter={zoneFilter} setZoneFilter={setZoneFilter} />
      </main>

      <Footer />
    </>
  );
}
