import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-media" aria-hidden="true">
        <div className="hero-look hero-look-large" />
        <div className="hero-look hero-look-small" />
      </div>
      <div className="hero-content">
        <p className="eyebrow">Nova seleção da semana</p>
        <h1>Catálogo de moda feminina</h1>
        <p>
          Uma vitrine elegante para clientes descobrirem peças, salvar em favoritos e
          chamarem no WhatsApp com o código certo.
        </p>
        <div className="hero-actions">
          <Link className="button button-primary" to="/catalogo">
            Ver catálogo
          </Link>
          <Link className="button button-secondary" to="/favoritos">
            Meus favoritos
          </Link>
        </div>
      </div>
    </section>
  );
}
