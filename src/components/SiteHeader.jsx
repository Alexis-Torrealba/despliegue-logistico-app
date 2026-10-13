// WebP a 2× del tamaño mostrado (64px): ~8 KB en vez de los 70 KB del PNG original
import caritasIsotipo from "../assets/caritas-isotipo.webp";

// Solo identidad: es una página única, así que no lleva menú propio
export default function SiteHeader() {
  return (
    <header id="inicio" className="border-b-[3px] border-caritas bg-night">
      <div className="mx-auto flex max-w-[1160px] items-center px-5 py-4 mobile:py-3">
        <a className="flex items-center gap-[0.9rem] text-white no-underline" href="#inicio">
          <img
            className="h-16 w-auto rounded-xl bg-white p-[7px] shadow-[0_6px_18px_-6px_#00000080] mobile:h-12 mobile:rounded-[10px] mobile:p-[5px]"
            src={caritasIsotipo}
            width="144"
            height="144"
            fetchPriority="high"
            alt="Isotipo de Cáritas"
          />
          <span className="text-[1.4rem] font-semibold leading-[1.1] tracking-[-0.02em] mobile:text-[1.15rem]">
            Cáritas La Guaira
            <small className="mt-1 block text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-[#ffffffb3]">
              Pastoral Social · Diócesis de La Guaira
            </small>
          </span>
        </a>
      </div>
    </header>
  );
}
