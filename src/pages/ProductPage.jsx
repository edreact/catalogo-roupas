import { Link, useParams } from "react-router-dom";
import ProductBadges from "../components/product/ProductBadges.jsx";
import useCatalog from "../hooks/useCatalog.js";
import { formatCurrency } from "../utils/formatters.js";
import { gerarLinkWhatsApp } from "../utils/whatsapp";
import { useFavorites } from "../context/FavoritesContext.jsx";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import ProductGallery from "../components/product/ProductGallery.jsx";

export default function ProductPage() {
  const { slug } = useParams();
  const { products, isLoading } = useCatalog();
  const { toggleFavorite, isFavorite } = useFavorites();
  const product = products.find(
    (item) => item.slug === slug || item.code === slug,
  );
  
  const selected = product ? isFavorite(product.code) : false;
  if (isLoading) {
    return (
      <section className="page-section product-detail-shell">
        <div className="product-gallery-placeholder" />
        <div className="product-detail-copy">
          <p className="eyebrow">Carregando</p>
          <h1>Buscando produto</h1>
          <p>Estamos consultando os dados do catálogo.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="page-section product-detail-shell">

      {product && <ProductGallery product={product} />}

      <div className="product-detail-copy">
        <p className="eyebrow">Produto</p>
        <h1>{product?.name || "Produto nao encontrado"}</h1>
        {product ? (
          <>
            <ProductBadges badges={product.badges} />

            <p>{product.description}</p>
            
            <dl className="product-facts">
              <div>
                <dt>Código</dt>
                <dd>{product.code}</dd>
              </div>
              <div>
                <dt>Preço</dt>
                <dd>{formatCurrency(product.salePrice || product.price)}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{product.status}</dd>
              </div>
            </dl>
          </>
        ) : (
          <p>
            Este produto ainda não foi encontrado nos dados atuais do catálogo.
          </p>
        )}
        <div className="product-actions">
          {product && (
            <a
              className="button button-whatsapp"
              href={gerarLinkWhatsApp(product)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Comprar pelo WhatsApp
            </a>
          )}

          {product && (
            <button
              type="button"
              className={`button ${
                selected ? "button-primary" : "button-secondary"
              }`}
              onClick={() => toggleFavorite(product.code)}
            >
              {selected ? <FaHeart /> : <FiHeart />}

              {selected ? " Remover da seleção" : " Adicionar à seleção"}
            </button>
          )}

          <Link className="button button-primary" to="/catalogo">
            Voltar ao catálogo
          </Link>
        </div>
        
      </div>

      {product && (
  <div className="product-detail-copy">
    {(product.color ||
      product.fullDescription ||
      product.brand ||
      product.size ||
      product.material ||
      product.measurements ||
      product.care ||
      product.occasion) && (
      <details className="product-details-dropdown">
        <summary>Ver detalhes do produto</summary>

        <div className="product-details">
          {product.color && <p><strong>Cor:</strong> {product.color}</p>}
          {product.fullDescription && <p><strong>Descrição:</strong> {product.fullDescription}</p>}
          {product.brand && <p><strong>Marca:</strong> {product.brand}</p>}
          {product.size && <p><strong>Tamanho:</strong> {product.size}</p>}
          {product.material && <p><strong>Material:</strong> {product.material}</p>}
          {product.measurements && <p><strong>Medidas:</strong> {product.measurements}</p>}
          {product.care && <p><strong>Cuidados:</strong> {product.care}</p>}
          {product.occasion && <p><strong>Ocasião:</strong> {product.occasion}</p>}
        </div>
      </details>
    )}
  </div>
)}

    </section>
  );
}
