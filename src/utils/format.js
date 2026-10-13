// Para buscar sin importar mayúsculas ni acentos: "naiguata" encuentra "Naiguatá"
export function normalize(s) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

const PCT = new Intl.NumberFormat("es-VE", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

// Proporción (0 a 1) como porcentaje venezolano: 0.388 → "38,8%"
export function fmtPct(ratio) {
  return PCT.format(ratio);
}

export function fmt(n) {
  return n.toLocaleString("es-VE", {
    minimumFractionDigits: n % 1 === 0 ? 0 : 1,
    maximumFractionDigits: 1,
  });
}
