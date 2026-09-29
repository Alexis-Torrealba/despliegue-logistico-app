import caritasLogo from "../assets/caritas-logo.png";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__top">
          <img className="site-footer__logo" src={caritasLogo} alt="Logo Cáritas La Guaira" />
          <div className="site-footer__contact">
            <h3 className="site-footer__heading">Contáctanos</h3>
            <p className="site-footer__intro">
              Coordinamos la respuesta humanitaria al terremoto en el estado La Guaira.
            </p>
            <ul className="site-footer__details">
              <li>
                <span className="site-footer__label">Dirección</span>
                Macuto, frente al Seminario San Pedro Apóstol
              </li>
              <li>
                <span className="site-footer__label">Teléfono</span>
                <a href="tel:+584241441744">+58 424-144-17-44</a>
              </li>
              <li>
                <span className="site-footer__label">Correo</span>
                <a href="mailto:caritasdiocesisdelaguaira@gmail.com">
                  caritasdiocesisdelaguaira@gmail.com
                </a>
              </li>
              <li>
                <span className="site-footer__label">Instagram</span>
                <a href="https://www.instagram.com/caritaslg">@caritaslg</a>
              </li>
            </ul>
          </div>
        </div>
        <p className="site-footer__note">
          Datos consolidados del Informe de Despliegue Logístico Post-Terremoto · Estado La Guaira
        </p>
      </div>
    </footer>
  );
}
