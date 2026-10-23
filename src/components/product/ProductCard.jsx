import { Link } from "react-router-dom";
import ProductBadges from "./ProductBadges.jsx";
import FavoriteButton from "../favorites/FavoriteButton.jsx";
import { formatCurrency } from "../../utils/formatters.js";

export default function ProductCard({ product, confirmFavoriteRemoval = false }) {
  const hasSale = Boolean(product.salePrice);
  const isSold = product.status === "Vendido";
  const temVideoDestaque =
    (product.videoDestaque === true || product.videoDestaque === "TRUE") &&
    typeof product.videoUrl === "string" &&
    product.videoUrl.trim() !== "";
  const selectedImageIndex = product.favoriteImg
    ? product.favoriteImg - (product.videoUrl ? 2 : 1)
    : 0;
  const image = product.images?.[selectedImageIndex] || product.images?.[0];
  const productPath = `/produto/${product.slug}${
    product.favoriteImg ? `?img=${product.favoriteImg}` : ""
  }`;

  return (
    <article
      className={`product-card real-product-card ${
        isSold ? "is-sold" : ""
      }`}
    >
      <div className="product-image-wrapper">

        <FavoriteButton
          product={product}
          img={product.favoriteImg ?? 1}
          confirmRemoval={confirmFavoriteRemoval}
        />

        <Link
          to={productPath}
          className="product-image-link"
        >
          <div className={`product-art product-art-${product.imageTone}`}>
            {temVideoDestaque ? (
              <video
                src={product.videoUrl}
                poster={product.videoPosterUrl || image}
                aria-label={`Vídeo de destaque: ${product.name}`}
                muted
                playsInline
                autoPlay
                loop
                preload="metadata"
              />
            ) : (
              image && (
                <img
                  src={image}
                  alt={product.name}
                  loading="lazy"
                />
              )
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
            <Link to={productPath}>
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
            to={productPath}
          >
            Ver
          </Link>

        </div>

      </div>

    </article>
  );
}