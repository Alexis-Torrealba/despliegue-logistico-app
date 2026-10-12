import { useState } from "react";
import SiteHeader from "./components/SiteHeader.jsx";
import Header from "./components/Header.jsx";
import ZoneDistributionCard from "./components/ZoneDistributionCard.jsx";
import DonorsCard from "./components/DonorsCard.jsx";
import TopParishesCard from "./components/TopParishesCard.jsx";
import MapCard from "./components/MapCard.jsx";
import ParishTable from "./components/ParishTable.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  const [zoneFilter, setZoneFilter] = useState("Todas");

  return (
    <>
      <SiteHeader />

      <main className="mx-auto w-full min-w-0 max-w-[1160px] px-5 pt-8 pb-[60px]">
        <Header zoneFilter={zoneFilter} setZoneFilter={setZoneFilter} />

        <div
          id="resumen"
          className="mb-4.5 grid grid-cols-[1.15fr_0.85fr] gap-4.5 stack:grid-cols-1"
        >
          <ZoneDistributionCard />
          <DonorsCard />
        </div>

        <TopParishesCard />

        <MapCard />

        <ParishTable zoneFilter={zoneFilter} setZoneFilter={setZoneFilter} />
      </main>

      <Footer />
    </>
  );
}
