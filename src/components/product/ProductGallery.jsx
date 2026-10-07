import { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import FavoriteButton from "../favorites/FavoriteButton.jsx";
import { compartilharProdutoWhatsApp } from "../../utils/whatsapp";
import { FiShare2 } from "react-icons/fi";

const CLOUDINARY_TRANSFORM = "f_auto,q_auto";

function addCloudinaryTransform(url) {
  if (typeof url !== "string" || !url.includes("/upload/")) {
    return url;
  }

  if (url.includes("/upload/f_auto,q_auto/")) {
    return url;
  }

  return url.replace("/upload/", `/upload/${CLOUDINARY_TRANSFORM}/`);
}

function getImagePosterUrl(url, fallback) {
  if (typeof url !== "string" || !url.includes("/image/upload/")) {
    return fallback;
  }

  return addCloudinaryTransform(url);
}

export default function ProductGallery({ product }) {
  const images = (product?.images || []).filter(Boolean);
  const videoUrl = product?.videoUrl;
  const videoPosterUrl = product?.videoPosterUrl;
  const media = videoUrl
    ? [
        { type: "video", src: addCloudinaryTransform(videoUrl) },
        ...images.map((src) => ({ type: "image", src: addCloudinaryTransform(src) })),
      ]
    : images.map((src) => ({ type: "image", src: addCloudinaryTransform(src) }));
  const initialImage = (() => {
    const img = Number(new URLSearchParams(window.location.search).get("img"));

    return img > 0 ? Math.min(img - 1, media.length - 1) : 0;
  })();

  const [current, setCurrent] = useState(initialImage);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showVideoPlayButton, setShowVideoPlayButton] = useState(false);
  const videoRef = useRef(null);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const MIN_SWIPE_DISTANCE = 50;
  const currentMedia = media[current];

  useEffect(() => {
    setIsVideoPlaying(false);
    setShowVideoPlayButton(false);
  }, [current]);

  useEffect(() => {
    if (currentMedia?.type !== "video" || isVideoPlaying) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setShowVideoPlayButton(true);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [currentMedia?.type, isVideoPlaying]);

  if (!media.length) {
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
    setCurrent((prev) => (prev === 0 ? media.length - 1 : prev - 1));
  }

  function nextImage() {
    setCurrent((prev) => (prev === media.length - 1 ? 0 : prev + 1));
  }

  function playVideo() {
    if (!videoRef.current) {
      return;
    }

    setShowVideoPlayButton(false);
    setIsVideoPlaying(true);
    videoRef.current.play().catch(() => setIsVideoPlaying(false));
  }

  return (
    <div className={`product-gallery ${isVideoPlaying ? "video-playing" : ""}`}>
      <div
        className={`product-gallery-placeholder product-art-${product.imageTone}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <FavoriteButton product={product} />

        <button
          className="share-button"
          onClick={() => compartilharProdutoWhatsApp(product, current)}
          aria-label="Compartilhar produto"
        >
          <FiShare2 size={20} className="share-icon" />
        </button>

        {currentMedia.type === "video" ? (
          <>
            <img
              className="gallery-video-poster"
              src={getImagePosterUrl(videoPosterUrl, images[0])}
              alt={`${product.name} - capa do vídeo`}
            />
            <video
              ref={videoRef}
              className={`gallery-video ${isVideoPlaying ? "is-playing" : ""}`}
              src={currentMedia.src}
              poster={getImagePosterUrl(videoPosterUrl, images[0])}
              loop
              muted
              playsInline
              preload="none"
              controls={isVideoPlaying}
              aria-label={`Vídeo de introdução de ${product.name}`}
              onPlay={() => setIsVideoPlaying(true)}
              onPause={() => setIsVideoPlaying(false)}
            />
            {showVideoPlayButton && (
              <button
                className="gallery-video-play"
                type="button"
                onClick={playVideo}
                aria-label="Reproduzir vídeo"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 5.5 18.5 12 7 18.5Z" />
                </svg>
              </button>
            )}
          </>
        ) : (
          <img src={currentMedia.src} alt={product.name} />
        )}

        {media.length > 1 && (
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

      {media.length > 1 && (
        <div className="product-thumbnails">
          {media.map((item, index) => (
            <button
              key={`${item.type}-${index}`}
              className={current === index ? "thumbnail active" : "thumbnail"}
              onClick={() => setCurrent(index)}
              aria-label={item.type === "video" ? "Ver vídeo" : `Ver imagem ${index}`}
            >
              {item.type === "video" ? (
                <img
                  src={getImagePosterUrl(videoPosterUrl, images[0])}
                  alt={`${product.name} - vídeo`}
                />
              ) : (
                <img src={item.src} alt={`${product.name} ${index + 1}`} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
