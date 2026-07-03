import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="page-section empty-state">
      <p className="eyebrow">404</p>
      <h1>Página não encontrada</h1>
      <p>O link pode ter mudado ou o produto ainda não está disponível no catalogo.</p>
      <Link className="button button-primary" to="/">
        Ir para o inicio
      </Link>
    </section>
  );
}
