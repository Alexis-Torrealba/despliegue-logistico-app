import caritasIsotipo from "../assets/caritas-isotipo.png";

export default function SiteHeader() {
  return (
    <header id="inicio" className="site-header">
      <div className="site-header__inner">
        <a className="brand" href="#inicio">
          <img className="brand__logo" src={caritasIsotipo} alt="Isotipo de Cáritas" />
          <span className="brand__name">
            Cáritas La Guaira
            <small>Pastoral Social · Diócesis de La Guaira</small>
          </span>
        </a>
        <nav className="site-nav" aria-label="Navegación principal">
          <a href="#inicio">Inicio</a>
          <a href="#resumen">Informe</a>
        </nav>
      </div>
    </header>
  );
}
