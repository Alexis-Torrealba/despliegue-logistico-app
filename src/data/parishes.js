export const ZONE_COLORS = {
  Este: "#c4513f",
  Centro: "#d49a3a",
  "Catia La Mar": "#4f9ea3",
  Montaña: "#93a152",
};

export const PARISHES = [
  // Zona Este
  { name: "S.D.G de Tanaguarenas", zone: "Este", tons: 750.3, vehicles: 50, zeroZone: true },
  { name: "N.S.C de Caraballeda", zone: "Este", tons: 701.4, vehicles: 43, zeroZone: true },
  { name: "E.S de Los Corales", zone: "Este", tons: 708.4, vehicles: 43, zeroZone: true },
  { name: "S.B de Macuto", zone: "Este", tons: 764.5, vehicles: 51, zeroZone: true },
  { name: "S.J de La Sabana", zone: "Este", tons: 160, vehicles: 9 },
  { name: "S.F.A de Naiguatá", zone: "Este", tons: 723, vehicles: 44 },
  // Zona Centro
  { name: "S.C.M de Punta De Mulatos", zone: "Centro", tons: 74.5, vehicles: 4 },
  { name: "S.P.A de Catedral", zone: "Centro", tons: 1105.2, vehicles: 70 },
  { name: "S.S de Maiquetía", zone: "Centro", tons: 170.2, vehicles: 9 },
  { name: "I.C.M de Pariata", zone: "Centro", tons: 590.6, vehicles: 37 },
  { name: "S.M.P de Montesano", zone: "Centro", tons: 90, vehicles: 4 },
  { name: "S.T de La Aviación", zone: "Centro", tons: 725, vehicles: 45 },
  // Zona Catia La Mar
  { name: "N.S.C de Guaracarumbo", zone: "Catia La Mar", tons: 737, vehicles: 47 },
  { name: "B.M.S.J de Zamora", zone: "Catia La Mar", tons: 75.9, vehicles: 4 },
  { name: "N.S.V de Mirabal", zone: "Catia La Mar", tons: 124.1, vehicles: 6 },
  { name: "S.C.J de La Páez", zone: "Catia La Mar", tons: 94, vehicles: 4, zeroZone: true },
  { name: "S.O Arnulfo Romero", zone: "Catia La Mar", tons: 50, vehicles: 3, zeroZone: true },
  { name: "N.S.M de Playa Grande", zone: "Catia La Mar", tons: 50, vehicles: 3, zeroZone: true },
  { name: "N.S.C de La Soublette", zone: "Catia La Mar", tons: 940, vehicles: 59, zeroZone: true },
  { name: "S.J.O de Mamo", zone: "Catia La Mar", tons: 557, vehicles: 35 },
  { name: "M.A de Las Tunitas", zone: "Catia La Mar", tons: 126.3, vehicles: 7 },
  { name: "S.M.A de Vista al Mar", zone: "Catia La Mar", tons: 240, vehicles: 14 },
  // Zona Montaña
  { name: "N.S.M de El Junquito", zone: "Montaña", tons: 150, vehicles: 8 },
  { name: "S.J de Carayaca", zone: "Montaña", tons: 50, vehicles: 3 },
  { name: "N.S.C de Tarmas", zone: "Montaña", tons: 33.7, vehicles: 2 },
  { name: "S.I.L de La Peñita", zone: "Montaña", tons: 31.9, vehicles: 2 },
];

export const TOTAL_TONS = PARISHES.reduce((s, p) => s + p.tons, 0);
export const TOTAL_VEHICLES = PARISHES.reduce((s, p) => s + p.vehicles, 0);

export function zoneAggregate(zoneName) {
  const items = PARISHES.filter((p) => p.zone === zoneName);
  return {
    tons: items.reduce((s, p) => s + p.tons, 0),
    vehicles: items.reduce((s, p) => s + p.vehicles, 0),
    count: items.length,
  };
}

export const ZONES = Object.keys(ZONE_COLORS).map((name) => ({
  name,
  color: ZONE_COLORS[name],
  ...zoneAggregate(name),
}));
