export const DONORS = [
  { name: "Cáritas Nacional", tons: 5130.6, vehicles: 40, note: "En camiones" },
  { name: "GEM", tons: 2400, vehicles: 160, note: "En gandolas" },
  { name: "Empresa Polar", tons: 680, vehicles: 60, note: "Agua embotellada" },
  { name: "Red de Cáritas Diocesanas", tons: 750, vehicles: 40, note: "En camiones" },
  { name: "Coromoto 2020", tons: 20, vehicles: 4, note: "En camiones" },
  { name: "Otras donaciones", tons: 842.3, vehicles: 28, note: "Fuentes varias" },
];

export const DONOR_COLORS = ["#c4513f", "#d49a3a", "#4f9ea3", "#93a152", "#e3a898", "#9c8f82"];

// Vehículos aportados por cada donante (mismo orden y colores que DONORS)
export const FLEET_SOURCES = [
  { donor: "Cáritas Nacional", count: "268" },
  { donor: "GEM", count: "110", icon: "gandola" },
  { donor: "Empresa Polar", count: "120" },
  { donor: "Red de Cáritas Diocesanas", count: "45" },
  { donor: "Coromoto 2020", count: "5" },
  { donor: "Otras donaciones", count: "+58" },
];
