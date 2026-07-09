import { Link } from "react-router-dom";
import ProductBadges from "./ProductBadges.jsx";
import FavoriteButton from "../favorites/FavoriteButton.jsx";
import { formatCurrency } from "../../utils/formatters.js";

export default function ProductCard({ product }) {
  const hasSale = Boolean(product.salePrice);
  const isSold = product.status === "Vendido";
  const image = product.images?.[0];

  return (
    <article
      className={`product-card real-product-card ${
        isSold ? "is-sold" : ""
      }`}
    >
      <div className="product-image-wrapper">

        <FavoriteButton product={product} />

        <Link
          to={`/produto/${product.slug}`}
          className="product-image-link"
        >
          <div className={`product-art product-art-${product.imageTone}`}>
            {image && (
              <img
                src={image}
                alt={product.name}
                loading="lazy"
              />
            )}

            <ProductBadges badges={product.badges} />

            {/* <span className="product-code">
              {product.code}
            </span> */}
          </div>
        </Link>

      </div>

      <div className="product-card-body">

        <div>

          <p className="product-meta">
            {product.category}
            {product.size ? ` - ${product.size}` : ""}
          </p>

          <h3>
            <Link to={`/produto/${product.slug}`}>
              {product.name}
            </Link>
          </h3>

        </div>

        <div className="product-card-footer">

          <div className="price-block">

            {hasSale && (
              <span className="old-price">
                {formatCurrency(product.price)}
              </span>
            )}

            <strong>
              {formatCurrency(product.salePrice || product.price)}
            </strong>

          </div>

          <Link
            className="mini-action"
            to={`/produto/${product.slug}`}
          >
            Ver
          </Link>

        </div>

      </div>

    </article>
  );
}