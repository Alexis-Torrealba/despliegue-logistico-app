import caritasIsotipo from "../assets/caritas-isotipo.png";

export default function SiteHeader() {
  const navLink =
    "text-[0.95rem] font-semibold text-[#ffffffe6] no-underline decoration-caritas decoration-2 underline-offset-[6px] hover:text-white hover:underline";

  return (
    <header id="inicio" className="border-b-[3px] border-caritas bg-night">
      <div className="mx-auto flex max-w-[1160px] flex-wrap items-center justify-between gap-4 px-5 py-4">
        <a
          className="flex items-center gap-[0.9rem] font-serif text-white no-underline"
          href="#inicio"
        >
          <img
            className="h-16 w-auto rounded-xl bg-white p-[7px] shadow-[0_6px_18px_-6px_#00000080]"
            src={caritasIsotipo}
            alt="Isotipo de Cáritas"
          />
          <span className="text-[1.4rem] font-bold leading-[1.1]">
            Cáritas La Guaira
            <small className="mt-1 block font-sans text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-[#ffffffb3]">
              Pastoral Social · Diócesis de La Guaira
            </small>
          </span>
        </a>
        <nav className="flex flex-wrap items-center gap-5" aria-label="Navegación principal">
          <a className={navLink} href="#inicio">
            Inicio
          </a>
          <a className={navLink} href="#resumen">
            Informe
          </a>
        </nav>
      </div>
    </header>
  );
}
