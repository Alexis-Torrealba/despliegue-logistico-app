// Etiqueta de Zona Cero. En la tabla se abrevia a "ZC" en móvil (lo explica la leyenda);
// con `full` dice siempre "Zona Cero", como en el modal, donde no hay leyenda al lado
export default function ZeroZoneTag({ full = false, className = "", ...props }) {
  return (
    <span
      className={`inline-block shrink-0 whitespace-nowrap rounded-[3px] bg-caritas px-[7px] py-px text-[10px] font-bold uppercase tracking-[0.04em] text-white ${className}`}
      {...props}
    >
      {full ? (
        "Zona Cero"
      ) : (
        <>
          <span className="mobile:hidden">Zona Cero</span>
          <span className="hidden mobile:inline">ZC</span>
        </>
      )}
    </span>
  );
}
