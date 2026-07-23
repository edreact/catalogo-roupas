import { Link } from "react-router-dom";
import listaProdutos from "../data/produtos.json";
import { useFavorites } from "../context/FavoritesContext.jsx";
import ProductCard from "../components/product/ProductCard.jsx";
import { gerarLinkWhatsAppFavoritos } from "../utils/whatsapp.js";
import { FaWhatsapp } from "react-icons/fa";

export default function FavoritesPage() {
  const { favorites } = useFavorites(); // ["VF-1001"]
  const products = listaProdutos.products || []; // [{code: "VF-1001", ...}]

  // CORREÇÃO AQUI: Mudamos de product.id para product.code
  const favoriteProducts =
    products?.filter((product) => favorites?.includes(product.code)) || [];

  if (favoriteProducts.length === 0) {
    return (
      <section className="page-section empty-state">
        <p className="eyebrow">Favoritos</p>
        <h1>Sua seleção ficará aqui</h1>
        <p>
          Os produtos favoritos serão salvos no navegador e poderão ser enviados
          juntos pelo WhatsApp.
        </p>
        <Link className="button button-primary" to="/catalogo">
          Explorar produtos
        </Link>
      </section>
    );
  }

  return (
    <main className="page-section">
      <p className="eyebrow">Favoritos ({favoriteProducts.length})</p>

      <div className="product-grid">
        {favoriteProducts.map((product) => (
          // Usando o code como key por garantia
          <ProductCard key={product.code} product={product} />
        ))}
      </div>
      {/* NOVO BLOCO: Botão para enviar toda a lista via WhatsApp */}
      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <a
          className="button button-primary whatsapp-button"
          href={gerarLinkWhatsAppFavoritos(favoriteProducts)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaWhatsapp className="whatsapp-button-icon" />
          <span>Envie sua seleção pelo WhatsApp</span>
        </a>
      </div>
    </main>
  );
}
