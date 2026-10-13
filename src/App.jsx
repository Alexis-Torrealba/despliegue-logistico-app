import { useCallback, useEffect, useState } from "react";
import SiteHeader from "./components/SiteHeader.jsx";
import Header from "./components/Header.jsx";
import SectionNav from "./components/SectionNav.jsx";
import ZoneDistributionCard from "./components/ZoneDistributionCard.jsx";
import DonorsCard from "./components/DonorsCard.jsx";
import TopParishesCard from "./components/TopParishesCard.jsx";
import MapCard from "./components/MapCard.jsx";
import ParishTable from "./components/ParishTable.jsx";
import ParishModal from "./components/ParishModal.jsx";
import Footer from "./components/Footer.jsx";
import { PARISH_BY_MAP_ID } from "./data/parishes.js";

// Cada parroquia tiene su enlace (#parroquia/la-paez) para compartirla directamente
const HASH_PREFIX = "#parroquia/";

function parishFromHash() {
  const { hash } = window.location;
  return hash.startsWith(HASH_PREFIX)
    ? (PARISH_BY_MAP_ID[hash.slice(HASH_PREFIX.length)] ?? null)
    : null;
}

export default function App() {
  const [selected, setSelected] = useState(parishFromHash);

  // replaceState y no location.hash: cambiar el hash a mano haría saltar el scroll
  const openParish = useCallback((parish) => {
    history.replaceState(null, "", `${HASH_PREFIX}${parish.mapId}`);
    setSelected(parish);
  }, []);
  const closeParish = useCallback(() => {
    history.replaceState(null, "", window.location.pathname + window.location.search);
    setSelected(null);
  }, []);

  // Un enlace pegado en la barra o usado con atrás/adelante
  useEffect(() => {
    const onHash = () => setSelected(parishFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return (
    <>
      <SiteHeader />

      <main className="mx-auto w-full min-w-0 max-w-[1160px] px-5 pt-8 pb-[60px] mobile:px-4 mobile:pt-6">
        <Header onSelectParish={openParish} />
        <SectionNav />

        <div
          id="resumen"
          className="mb-4.5 grid grid-cols-[1.15fr_0.85fr] gap-4.5 stack:grid-cols-1"
        >
          <ZoneDistributionCard />
          <DonorsCard />
        </div>

        <TopParishesCard />

        <MapCard onSelectParish={openParish} />

        <ParishTable onSelectParish={openParish} />
      </main>

      <Footer />

      {selected && <ParishModal parish={selected} onClose={closeParish} />}
    </>
  );
}
