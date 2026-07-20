import "./Footer.css";
import edreactLogo from "../../assets/edreact-logo.png";


export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">

        <p className="footer-copy">
          © {year} Todos os direitos reservados.
        </p>

        <div className="footer-dev">
          <span>By </span>

          <a
            href="mailto:edreactwebdesign@gmail.com"
            className="footer-logo-link"
            aria-label="Entrar em contato com Edreact"
            title="Entrar em contato com Edreact"
          >
            <img
              src={edreactLogo}
              alt="Edreact"
              className="footer-logo"
            />
          </a>

        </div>

      </div>
    </footer>
  );
}