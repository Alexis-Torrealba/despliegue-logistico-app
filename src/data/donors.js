import { TOTAL_TONS, TOTAL_VEHICLES } from "./parishes.js";

// Toneladas y vehículos aportados por cada donante. Es la única fuente de la flota por
// donante: sus sumas deben coincidir con los totales por parroquia (ver el chequeo abajo)
export const DONORS = [
  { name: "Cáritas Nacional", tons: 5130.6, vehicles: 268, note: "En camiones" },
  { name: "GEM", tons: 2400, vehicles: 110, note: "En gandolas", icon: "gandola" },
  { name: "Empresa Polar", tons: 680, vehicles: 120, note: "Agua embotellada" },
  { name: "Red de Cáritas Diocesanas", tons: 750, vehicles: 45, note: "En camiones" },
  { name: "Coromoto 2020", tons: 20, vehicles: 5, note: "En camiones" },
  { name: "Otras donaciones", tons: 842.3, vehicles: 58, note: "Fuentes varias" },
];

// Al actualizar cifras, donantes y parroquias deben seguir sumando lo mismo. Se admite
// hasta 0,1 t de diferencia por el redondeo a un decimal de cada aporte
const donorTons = DONORS.reduce((s, d) => s + d.tons, 0);
const donorVehicles = DONORS.reduce((s, d) => s + d.vehicles, 0);
if (Math.abs(donorTons - TOTAL_TONS) > 0.1 + 1e-9 || donorVehicles !== TOTAL_VEHICLES) {
  console.error(
    `Las cifras no cuadran: donantes ${donorTons} t y ${donorVehicles} vehículos; ` +
      `parroquias ${TOTAL_TONS} t y ${TOTAL_VEHICLES} vehículos`,
  );
}
