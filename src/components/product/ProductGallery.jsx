import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import FavoriteButton from "../favorites/FavoriteButton.jsx";

export default function ProductGallery({ product }) {
  const images = product?.images || [];
  const [current, setCurrent] = useState(0);

  if (!images.length) {
    return (
      <div className="product-gallery-placeholder">
        Sem imagem
      </div>
    );
  }

  function previousImage() {
    setCurrent((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  }

  function nextImage() {
    setCurrent((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  }

  return (
    <div className="product-gallery">

      <div
        className={`product-gallery-placeholder product-art-${product.imageTone}`}
      >
        <FavoriteButton product={product} />

        <img
          src={images[current]}
          alt={product.name}
        />

        {images.length > 1 && (
          <>
            <button
              className="gallery-arrow left"
              onClick={previousImage}
            >
              <FiChevronLeft />
            </button>

            <button
              className="gallery-arrow right"
              onClick={nextImage}
            >
              <FiChevronRight />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="product-thumbnails">
          {images.map((image, index) => (
            <button
              key={index}
              className={
                current === index
                  ? "thumbnail active"
                  : "thumbnail"
              }
              onClick={() => setCurrent(index)}
            >
              <img
                src={image}
                alt={`${product.name} ${index + 1}`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}