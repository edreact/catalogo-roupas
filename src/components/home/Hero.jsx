import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatters.js';

const getHeroImage = (product) => product?.imagemDestaque || '';

export default function Hero({ featuredProducts = [] }) {
  const carouselProducts = useMemo(
    () =>
      featuredProducts.filter(
        (product) => product?.slug && product?.imagemDestaque
      ),
    [featuredProducts],
  );

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (carouselProducts.length < 2) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % carouselProducts.length);
    }, 4600);

    return () => window.clearInterval(timer);
  }, [carouselProducts.length]);

  useEffect(() => {
    if (activeIndex >= carouselProducts.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, carouselProducts.length]);

  // Funções manuais para as setas laterais
  const nextSlide = (e) => {
    e.preventDefault(); // Impede o clique de ir para o produto
    setActiveIndex((prev) => (prev + 1) % carouselProducts.length);
  };

  const prevSlide = (e) => {
    e.preventDefault(); // Impede o clique de ir para o produto
    setActiveIndex((prev) => (prev - 1 + carouselProducts.length) % carouselProducts.length);
  };

  return (
    <section className="hero-section">
      <div className="hero-media">
        {carouselProducts.length > 0 ? (
          <div className="hero-featured-carousel" aria-label="Produtos em destaque">
            {carouselProducts.map((product, index) => {
              const isActive = index === activeIndex;
              const price = product.salePrice || product.price;
              const heroImage = getHeroImage(product);

              return (
                <Link
                  key={product.code || product.slug}
                  className={`hero-featured-slide ${isActive ? 'is-active' : ''}`}
                  to={`/produto/${product.slug}`}
                  aria-hidden={!isActive}
                  tabIndex={isActive ? 0 : -1}
                >
                  <img
                    src={heroImage}
                    alt={product.name}
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />

                  <div className="hero-featured-info">
                    <span>Produto em destaque</span>
                    <strong>{product.name}</strong>
                    <p>{product.description || product.category}</p>
                    <div>
                      <b>{formatCurrency(price)}</b>
                      <small>Ver produto</small>
                    </div>
                  </div>
                </Link>
              );
            })}

            {/* NOVOS BOTÕES DE SETA - VISÍVEIS NO MOBILE */}
            {carouselProducts.length > 1 && (
              <>
                <button 
                  type="button" 
                  className="hero-arrow hero-arrow-left" 
                  onClick={prevSlide}
                  aria-label="Slide anterior"
                >
                  &#10094;
                </button>
                <button 
                  type="button" 
                  className="hero-arrow hero-arrow-right" 
                  onClick={nextSlide}
                  aria-label="Próximo slide"
                >
                  &#10095;
                </button>
              </>
            )}

            {/* Pontinhos originais mantidos (o CSS vai esconder no mobile) */}
            {carouselProducts.length > 1 && (
              <div className="hero-carousel-dots" aria-label="Selecionar produto em destaque">
                {carouselProducts.map((product, index) => (
                  <button
                    key={product.code || product.slug}
                    type="button"
                    className={index === activeIndex ? 'is-active' : ''}
                    aria-label={`Mostrar ${product.name}`}
                    aria-pressed={index === activeIndex}
                    onClick={() => setActiveIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="hero-look hero-look-large" />
            <div className="hero-look hero-look-small" />
          </>
        )}
      </div>
      <div className="hero-content">
        <p className="eyebrow">NOVA SELEÇÃO DA SEMANA.</p>
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
