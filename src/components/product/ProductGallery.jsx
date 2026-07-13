import { useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import FavoriteButton from "../favorites/FavoriteButton.jsx";
import { compartilharProdutoWhatsApp } from "../../utils/whatsapp";

export default function ProductGallery({ product }) {
  const images = product?.images || [];
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const MIN_SWIPE_DISTANCE = 50;

  if (!images.length) {
    return <div className="product-gallery-placeholder">Sem imagem</div>;
  }

  function handleTouchStart(e) {
    touchStartX.current = e.targetTouches[0].clientX;
  }

  function handleTouchMove(e) {
    touchEndX.current = e.targetTouches[0].clientX;
  }

  function handleTouchEnd() {
    if (touchStartX.current === null || touchEndX.current === null) {
      return;
    }

    const distance = touchStartX.current - touchEndX.current;

    if (distance > MIN_SWIPE_DISTANCE) {
      nextImage();
    } else if (distance < -MIN_SWIPE_DISTANCE) {
      previousImage();
    }

    touchStartX.current = null;
    touchEndX.current = null;
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
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <FavoriteButton product={product} />

        <button
          type="button"
          className="share-button"
          onClick={() => compartilharProdutoWhatsApp(product)}
          aria-label="Compartilhar produto"
          title="Compartilhar produto"
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="18"
              cy="5"
              r="2.5"
              stroke="currentColor"
              strokeWidth="2"
            />

            <circle
              cx="6"
              cy="12"
              r="2.5"
              stroke="currentColor"
              strokeWidth="2"
            />

            <circle
              cx="18"
              cy="19"
              r="2.5"
              stroke="currentColor"
              strokeWidth="2"
            />

            <path
              d="M8.3 11L15.7 6.2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />

            <path
              d="M8.3 13L15.7 17.8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <img src={images[current]} alt={product.name} />

        {images.length > 1 && (
          <>
            <button className="gallery-arrow left" onClick={previousImage}>
              <FiChevronLeft />
            </button>

            <button className="gallery-arrow right" onClick={nextImage}>
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
              className={current === index ? "thumbnail active" : "thumbnail"}
              onClick={() => setCurrent(index)}
            >
              <img src={image} alt={`${product.name} ${index + 1}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}