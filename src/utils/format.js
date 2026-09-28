export function fmt(n) {
  return n.toLocaleString("es-VE", {
    minimumFractionDigits: n % 1 === 0 ? 0 : 1,
    maximumFractionDigits: 1,
  });
}
