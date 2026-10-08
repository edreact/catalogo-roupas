import { useCallback, useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
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
  if (typeof url !== "string" || !url.trim()) {
    return fallback;
  }

  return url.includes("/image/upload/") ? addCloudinaryTransform(url) : url;
}

export default function ProductGallery({ product }) {
  const images = (product?.images || []).filter(Boolean);
  const videoUrl = product?.videoUrl;
  const videoPosterUrl = product?.videoPosterUrl;
  const videoPoster = getImagePosterUrl(videoPosterUrl, images[0]);
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
  const [hasVideoStarted, setHasVideoStarted] = useState(false);
  const [hasVideoEnded, setHasVideoEnded] = useState(false);
  const [showVideoPlayButton, setShowVideoPlayButton] = useState(false);
  const [hasLeftVideo, setHasLeftVideo] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showGalleryUI, setShowGalleryUI] = useState(true);
  const videoRef = useRef(null);
  const lightboxVideoRef = useRef(null);
  const videoCurrentTime = useRef(0);
  const resumeVideoInLightbox = useRef(false);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const MIN_SWIPE_DISTANCE = 50;
  const currentMedia = media[current];

  const closeLightbox = useCallback(() => {
    if (currentMedia?.type === "video" && lightboxVideoRef.current) {
      const lightboxVideo = lightboxVideoRef.current;
      videoCurrentTime.current = lightboxVideo.currentTime;
      resumeVideoInLightbox.current =
        !lightboxVideo.paused && !lightboxVideo.ended;

      if (videoRef.current) {
        videoRef.current.currentTime = videoCurrentTime.current;
        if (resumeVideoInLightbox.current) {
          videoRef.current.play().catch(() => setIsVideoPlaying(false));
        }
      }

      setIsVideoPlaying(resumeVideoInLightbox.current);
    }

    setShowGalleryUI(true);
    setIsLightboxOpen(false);
  }, [currentMedia?.type]);

  useEffect(() => {
    setIsVideoPlaying(false);
    setShowVideoPlayButton(false);
  }, [current]);

  useEffect(() => {
    if (currentMedia?.type !== "video" || !videoRef.current || hasLeftVideo) {
      return;
    }

    videoRef.current.muted = true;
    videoRef.current.play().catch(() => setIsVideoPlaying(false));
  }, [currentMedia?.src, currentMedia?.type, hasLeftVideo]);

  useEffect(() => {
    if (currentMedia?.type !== "video" || isVideoPlaying || isLightboxOpen) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setShowVideoPlayButton(true);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [currentMedia?.type, isVideoPlaying, isLightboxOpen]);

  useEffect(() => {
    const lightboxVideo = lightboxVideoRef.current;

    if (!isLightboxOpen || currentMedia?.type !== "video" || !lightboxVideo) {
      return undefined;
    }

    function startLightboxVideo() {
      lightboxVideo.currentTime = videoCurrentTime.current;

      if (resumeVideoInLightbox.current) {
        lightboxVideo.play().catch(() => setIsVideoPlaying(false));
      }
    }

    if (lightboxVideo.readyState >= HTMLMediaElement.HAVE_METADATA) {
      startLightboxVideo();
      return undefined;
    }

    lightboxVideo.addEventListener("loadedmetadata", startLightboxVideo, {
      once: true,
    });
    return () =>
      lightboxVideo.removeEventListener("loadedmetadata", startLightboxVideo);
  }, [isLightboxOpen, currentMedia?.src, currentMedia?.type]);

  useEffect(() => {
    if (!isLightboxOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        closeLightbox();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeLightbox, isLightboxOpen]);

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
    changeSlide(current === 0 ? media.length - 1 : current - 1);
  }

  function nextImage() {
    changeSlide(current === media.length - 1 ? 0 : current + 1);
  }

  function changeSlide(index) {
    if (currentMedia?.type === "video" && index !== current) {
      if (isLightboxOpen && lightboxVideoRef.current) {
        const lightboxVideo = lightboxVideoRef.current;
        videoCurrentTime.current = lightboxVideo.currentTime;
        resumeVideoInLightbox.current =
          !lightboxVideo.paused && !lightboxVideo.ended;
        lightboxVideo.pause();
      } else if (videoRef.current) {
        videoCurrentTime.current = videoRef.current.currentTime;
        videoRef.current.pause();
      }

      setIsVideoPlaying(false);
      setHasLeftVideo(true);
    }

    setCurrent(index);
  }

  function playVideo() {
    const player = isLightboxOpen
      ? lightboxVideoRef.current
      : videoRef.current;

    if (!player) {
      return;
    }

    setShowVideoPlayButton(false);
    setHasVideoEnded(false);
    setIsVideoPlaying(true);
    player.play().catch(() => setIsVideoPlaying(false));
  }

  function handleVideoEnded(event) {
    event.currentTarget.currentTime = 0;
    videoCurrentTime.current = 0;
    resumeVideoInLightbox.current = false;
    setIsVideoPlaying(false);
    setHasVideoEnded(true);
    setShowVideoPlayButton(true);
  }

  function openLightbox() {
    if (isLightboxOpen) {
      return;
    }

    if (currentMedia?.type === "video" && videoRef.current) {
      const video = videoRef.current;
      videoCurrentTime.current = video.currentTime;
      resumeVideoInLightbox.current = !video.paused && !video.ended;
      setShowVideoPlayButton(false);
      setIsVideoPlaying(resumeVideoInLightbox.current);
    }

    setShowGalleryUI(true);
    setIsLightboxOpen(true);
  }

  const hideLightboxUI =
    isLightboxOpen &&
    currentMedia?.type === "video" &&
    isVideoPlaying &&
    !showGalleryUI;

  return (
    <div
      className={`product-gallery ${isVideoPlaying ? "video-playing" : ""} ${
        isLightboxOpen
          ? `lightbox-open ${
              resumeVideoInLightbox.current ? "video-resuming" : ""
            }`
          : ""
      } ${hideLightboxUI ? "gallery-ui-hidden" : ""}`}
    >
      <div
        className={`product-gallery-placeholder product-art-${product.imageTone}`}
        role={isLightboxOpen ? "dialog" : undefined}
        aria-modal={isLightboxOpen ? "true" : undefined}
        aria-label={isLightboxOpen ? `${product.name} - tela cheia` : undefined}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={(event) => {
          if (
            isLightboxOpen &&
            currentMedia?.type === "video" &&
            isVideoPlaying &&
            !event.target.closest("button")
          ) {
            setShowGalleryUI((visible) => !visible);
          }
        }}
      >
        {isLightboxOpen && (
          <button
            className="gallery-lightbox-close"
            type="button"
            onClick={closeLightbox}
            aria-label="Fechar tela cheia"
          >
            <FiX />
          </button>
        )}

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
              src={videoPoster}
              alt={`${product.name} - capa do vídeo`}
              onClick={openLightbox}
            />
            <div className="gallery-video-container">
              <video
                ref={videoRef}
                className={`gallery-video ${
                  isVideoPlaying ? "is-playing" : ""
                } ${hasVideoStarted ? "video-has-started" : ""} ${
                  hasVideoEnded ? "video-ended" : ""
                }`}
                src={currentMedia.src}
                poster={videoPoster}
                autoPlay={!hasLeftVideo}
                muted
                playsInline
                preload="none"
                controls={isLightboxOpen || isVideoPlaying}
                controlsList="nodownload"
                aria-label={`Vídeo de introdução de ${product.name}`}
                onLoadedMetadata={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = videoCurrentTime.current || 0;
                  }
                }}
                onPlay={() => {
                  setHasVideoStarted(true);
                  setHasVideoEnded(false);
                  setIsVideoPlaying(true);
                  setShowVideoPlayButton(false);
                }}
                onEnded={handleVideoEnded}
                onPause={() => {
                  if (videoRef.current) {
                    videoCurrentTime.current = videoRef.current.currentTime;
                  }
                  if (!isLightboxOpen) {
                    setIsVideoPlaying(false);
                  }
                }}
              />
              {!isLightboxOpen && !showVideoPlayButton && !hasVideoEnded && (
                <div
                  className="video-overlay-trigger"
                  role="button"
                  tabIndex={0}
                  aria-label="Ampliar vídeo"
                  onClick={openLightbox}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openLightbox();
                    }
                  }}
                />
              )}
            </div>
            {isLightboxOpen && (
              <video
                ref={lightboxVideoRef}
                className={`gallery-video gallery-lightbox-video ${
                  hasVideoStarted ? "video-has-started" : ""
                } ${hasVideoEnded ? "video-ended" : ""}`}
                src={currentMedia.src}
                poster={videoPoster}
                muted
                playsInline
                preload="auto"
                controls
                controlsList="nodownload"
                aria-label={`Vídeo de introdução de ${product.name}`}
                onTimeUpdate={(event) => {
                  videoCurrentTime.current = event.currentTarget.currentTime;
                }}
                onPlay={() => {
                  setHasVideoStarted(true);
                  setHasVideoEnded(false);
                  setIsVideoPlaying(true);
                }}
                onEnded={handleVideoEnded}
                onPause={() => {
                  videoCurrentTime.current =
                    lightboxVideoRef.current?.currentTime ?? videoCurrentTime.current;
                  setIsVideoPlaying(false);
                }}
              />
            )}
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
          <img
            src={currentMedia.src}
            alt={product.name}
            onClick={() => setIsLightboxOpen(true)}
          />
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
              onClick={() => changeSlide(index)}
              aria-label={item.type === "video" ? "Ver vídeo" : `Ver imagem ${index}`}
            >
              {item.type === "video" ? (
                <img
                  src={videoPoster}
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
