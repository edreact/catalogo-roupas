import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { useFavorites } from "../../context/FavoritesContext.jsx";
import useCatalog from "../../hooks/useCatalog.js";
import { gerarLinkWhatsAppFavoritos } from "../../utils/whatsapp.js";
import { FaWhatsapp } from "react-icons/fa";

export default function FavoritesWhatsAppFloat() {
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const { favorites } = useFavorites();
  const { products } = useCatalog();

  const favoriteProducts = favorites.flatMap((favorite) => {
    const product = products.find(
      (item) => String(item.code) === favorite.code,
    );

    return product ? [{ ...product, img: favorite.img }] : [];
  });

  useEffect(() => {
    if (!isSummaryOpen) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") setIsSummaryOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSummaryOpen]);

  if (favoriteProducts.length === 0) return null;

  const link = gerarLinkWhatsAppFavoritos(favoriteProducts);

  return (
    <>
      <button
        type="button"
        className="whatsapp-float-button"
        data-tooltip={buildTooltip(favoriteProducts)}
        onClick={() => setIsSummaryOpen(true)}
      >
        <FaWhatsapp className="whatsapp-icon" />
        Enviar seleção ({favoriteProducts.length})
      </button>

      {isSummaryOpen && (
        <div
          className="favorites-summary-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setIsSummaryOpen(false);
            }
          }}
        >
          <section
            className="favorites-summary-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="favorites-summary-title"
          >
            <header className="favorites-summary-header">
              <div>
                <p className="eyebrow">Sua seleção</p>
                <h2 id="favorites-summary-title">Confira seus produtos</h2>
              </div>
              <button
                type="button"
                className="favorites-summary-close"
                onClick={() => setIsSummaryOpen(false)}
                aria-label="Fechar resumo"
              >
                <FiX />
              </button>
            </header>

            <ul className="favorites-summary-list">
              {favoriteProducts.map((product) => {
                const imageIndex = product.img - (product.videoUrl ? 2 : 1);
                const image =
                  product.images?.[imageIndex] || product.images?.[0];

                return (
                  <li key={`${product.code}-${product.img}`}>
                    {image && (
                      <img
                        className="summary-item-thumb"
                        src={image}
                        alt={`${product.name} - imagem selecionada`}
                      />
                    )}
                    <div>
                      <span>{product.name}</span>
                      <span className="favorites-summary-code">
                        Código: {product.code}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>

            <footer className="favorites-summary-actions">
              <button
                type="button"
                className="button button-secondary"
                onClick={() => setIsSummaryOpen(false)}
              >
                Voltar
              </button>
              <a
                className="button button-whatsapp favorites-summary-confirm"
                href={link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp />
                Confirmar e Enviar Pedido
              </a>
            </footer>
          </section>
        </div>
      )}
    </>
  );
}

function buildTooltip(products) {
  const max = 4;

  const list = products.slice(0, max).map((p) => {
    return `• ${p.code} - ${p.name}`;
  });

  if (products.length > max) {
    list.push(`• +${products.length - max} itens...`);
  }

  return list.join("\n");
}