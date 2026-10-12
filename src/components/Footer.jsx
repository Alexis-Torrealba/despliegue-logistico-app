import caritasLogo from "../assets/caritas-logo.png";

const label = "text-[0.72rem] font-bold uppercase tracking-[0.06em] text-[#ffffff80]";
const link = "text-white no-underline hover:text-caritas-soft";

export default function Footer() {
  return (
    <footer className="mt-auto border-t-[3px] border-caritas bg-night text-[#ffffffd9]">
      <div className="mx-auto flex max-w-[1160px] flex-col gap-7 px-5 pt-10 pb-8">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <img
            className="h-[4.5rem] w-auto rounded-[10px] bg-white p-1.5"
            src={caritasLogo}
            alt="Logo Cáritas La Guaira"
          />
          <div className="min-w-[240px] max-w-[660px] flex-1">
            <h3 className="mt-0 mb-[0.4rem] text-[1.3rem] text-white">Contáctanos</h3>
            <p className="mt-0 mb-[1.1rem] text-[0.9rem] text-[#ffffffb3]">
              Coordinamos la respuesta humanitaria al terremoto en el estado La Guaira.
            </p>
            <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-x-6 gap-y-[0.9rem] p-0 text-[0.95rem]">
              <li className="flex flex-col gap-[0.15rem]">
                <span className={label}>Dirección</span>
                Macuto, frente al Seminario San Pedro Apóstol
              </li>
              <li className="flex flex-col gap-[0.15rem]">
                <span className={label}>Teléfono</span>
                <a className={link} href="tel:+584241441744">
                  +58 424-144-17-44
                </a>
              </li>
              <li className="flex flex-col gap-[0.15rem]">
                <span className={label}>Correo</span>
                <a className={link} href="mailto:caritasdiocesisdelaguaira@gmail.com">
                  caritasdiocesisdelaguaira@gmail.com
                </a>
              </li>
              <li className="flex flex-col gap-[0.15rem]">
                <span className={label}>Instagram</span>
                <a className={link} href="https://www.instagram.com/caritaslg">
                  @caritaslg
                </a>
              </li>
            </ul>
          </div>
        </div>
        <p className="m-0 border-t border-[#ffffff1f] pt-5 text-[0.8rem] text-[#ffffff8c]">
          Datos consolidados del Informe de Despliegue Logístico Post-Terremoto · Estado La Guaira
        </p>
      </div>
    </footer>
  );
}
