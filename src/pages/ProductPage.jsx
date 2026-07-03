import { Link, useParams } from "react-router-dom";
import ProductBadges from "../components/product/ProductBadges.jsx";
import useCatalog from "../hooks/useCatalog.js";
import { formatCurrency } from "../utils/formatters.js";
import { gerarLinkWhatsApp } from "../utils/whatsapp";

export default function ProductPage() {
  const { slug } = useParams();
  const { products, isLoading } = useCatalog();
  const product = products.find(
    (item) => item.slug === slug || item.code === slug,
  );
  const image = product?.images?.[0];

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
      <div
        className={`product-gallery-placeholder ${product ? `product-art-${product.imageTone}` : ""}`}
      >
        {image && <img src={image} alt={product.name} />}
      </div>
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

          <Link className="button button-primary" to="/catalogo">
            Voltar ao catálogo
          </Link>
        </div>
      </div>
    </section>
  );
}
