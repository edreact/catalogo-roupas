import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import ProductBadges from "../components/product/ProductBadges.jsx";
import listaProdutos from "../data/produtos.json";
import { formatCurrency } from "../utils/formatters.js";
import ProductGallery from "../components/product/ProductGallery.jsx";
import ProductDetails from "../components/product/ProductDetails.jsx";
import FavoritesWhatsAppFloat from "../components/favorites/FavoritesWhatsAppFloat.jsx";
import ProductRelated from "../components/product/ProductRelated.jsx";
import { gerarLinkWhatsApp } from "../utils/whatsapp";

export default function ProductPage() {
  const { slug } = useParams();
  const products = listaProdutos.products || [];
  const product = products.find(
    (item) => item.slug === slug || item.code === slug,
  );

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [slug]);

  return (
    <section className="page-section product-detail-shell product-page">
      {product && <ProductGallery product={product} />}

      <div className="product-detail-copy">
        <p className="eyebrow">Produto</p>
        <h1>{product?.name || "Produto nao encontrado"}</h1>
        {product ? (
          <>
            <ProductBadges badges={product.badges} horizontal />

            <p>{product.description}</p>

            <dl className="product-facts">
              <div>
                <dt>Codigo</dt>
                <dd>{product.code}</dd>
              </div>
              <div>
                <dt>Preco</dt>
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
            Este produto ainda nao foi encontrado nos dados atuais do catalogo.
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

          <Link className="button button-back" to="/catalogo">
            Voltar ao catalogo
          </Link>
          <FavoritesWhatsAppFloat />
        </div>
      </div>

      {product && (
        <div className="product-detail-copy">
          <ProductDetails product={product} />
        </div>
      )}

      <ProductRelated product={product} products={products} />
    </section>
  );
}
