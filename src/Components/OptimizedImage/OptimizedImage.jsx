import { useState, useRef, useEffect } from "react";

/**
 * OptimizedImage - A reusable image component with:
 * - Native lazy loading (loading="lazy") — configurable for above-fold images
 * - srcset/sizes for responsive images when small + large variants are provided
 * - Prefers WebP URLs when available (all modern browsers support WebP natively)
 * - Blur-up placeholder effect while loading
 * - Graceful error fallback
 *
 * NOTE: We intentionally use <img srcSet> instead of <picture>/<source> because
 * the images are served from a different origin (api.sightseeingroma.com).
 * <picture>/<source> triggers CORS-mode fetches which get blocked as
 * OpaqueResponseBlocking when the server doesn't return CORS headers on
 * static media files.  Plain <img srcSet> uses no-cors mode and works fine.
 *
 * Props:
 *   src          - Primary image URL (required fallback)
 *   srcSmall     - Small variant URL (for mobile / < 768px)
 *   srcLarge     - Large variant URL (for desktop / >= 768px)
 *   srcWebp      - WebP version of src
 *   srcSmallWebp - WebP version of srcSmall
 *   srcLargeWebp - WebP version of srcLarge
 *   alt          - Alt text (required)
 *   altSmall     - Alt text for small variant (optional, falls back to alt)
 *   altLarge     - Alt text for large variant (optional, falls back to alt)
 *   className    - Additional Tailwind classes for the <img>
 *   wrapperClassName - Additional Tailwind classes for the wrapper <div>
 *   eager        - If true, uses loading="eager" (for above-fold images)
 *   onClick      - Click handler
 *   onError      - Custom error handler
 *   sizes        - Custom sizes attribute (defaults to responsive breakpoint)
 *   fallbackSrc  - Fallback image on error
 */
const OptimizedImage = ({
  src,
  srcSmall,
  srcLarge,
  srcWebp,
  srcSmallWebp,
  srcLargeWebp,
  alt = "",
  altSmall,
  altLarge,
  className = "",
  wrapperClassName = "",
  eager = false,
  onClick,
  onError,
  sizes,
  fallbackSrc = "/placeholder-image.jpg",
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [useOriginal, setUseOriginal] = useState(false);
  const imgRef = useRef(null);

  // When useOriginal is false, prefer WebP URLs if available
  // When useOriginal is true (WebP failed), use original format URLs
  const bestSmall = useOriginal ? srcSmall : (srcSmallWebp || srcSmall);
  const bestLarge = useOriginal ? srcLarge : (srcLargeWebp || srcLarge);
  const bestSingle = useOriginal ? src : (srcWebp || src);

  // The src attribute (used as ultimate fallback)
  const effectiveSrc = bestLarge || bestSmall || bestSingle;
  const effectiveAlt = altLarge || altSmall || alt;

  // Build srcset if we have both small and large variants
  const hasSrcSet = bestSmall && bestLarge && bestSmall !== bestLarge;
  const srcSet = hasSrcSet ? `${bestSmall} 480w, ${bestLarge} 1024w` : undefined;
  const effectiveSizes = hasSrcSet
    ? sizes || "(max-width: 768px) 100vw, 50vw"
    : undefined;

  // Check if we're currently using a WebP URL (so we know if we can fall back)
  const isUsingWebpUrl = !useOriginal && (
    (srcSmallWebp && bestSmall === srcSmallWebp) ||
    (srcLargeWebp && bestLarge === srcLargeWebp) ||
    (srcWebp && bestSingle === srcWebp)
  );
  // Check if there are original (non-WebP) URLs to fall back to
  const hasOriginalFallback = src || srcSmall || srcLarge;

  // Reset loaded/error state when the image source changes
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
    setUseOriginal(false);

    // If the image is already cached/complete, mark loaded immediately
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [src, srcSmall, srcLarge, srcWebp, srcSmallWebp, srcLargeWebp]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = (e) => {
    if (onError) {
      onError(e);
      return;
    }

    // If we were using a WebP URL and there are original format URLs to fall back to,
    // switch to original format instead of going straight to placeholder
    if (isUsingWebpUrl && hasOriginalFallback) {
      setUseOriginal(true);
      setHasError(false);
      setIsLoaded(false);
      return;
    }

    // Final fallback — use placeholder
    setHasError(true);
    e.target.src = fallbackSrc;
  };

  return (
    <div className={`relative overflow-hidden ${wrapperClassName}`}>
      {/* Blur placeholder background — visible until image loads */}
      {!isLoaded && !hasError && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse"
          aria-hidden="true"
        />
      )}

      <img
        ref={imgRef}
        src={effectiveSrc}
        srcSet={srcSet}
        sizes={effectiveSizes}
        alt={effectiveAlt}
        loading={eager ? "eager" : "lazy"}
        decoding={eager ? "sync" : "async"}
        fetchpriority={eager ? "high" : undefined}
        onLoad={handleLoad}
        onError={handleError}
        onClick={onClick}
        className={`transition-opacity duration-500 ease-in-out ${
          isLoaded ? "opacity-100" : "opacity-0"
        } ${className}`}
      />
    </div>
  );
};

export default OptimizedImage;
