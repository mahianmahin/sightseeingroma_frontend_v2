import { useState, useRef, useEffect } from "react";

/**
 * OptimizedImage - A reusable image component with:
 * - Native lazy loading (loading="lazy") — configurable for above-fold images
 * - srcset/sizes for responsive images when small + large variants are provided
 * - WebP support via <picture>/<source> when webp URLs are available
 * - Blur-up placeholder effect while loading
 * - Graceful error fallback
 *
 * Props:
 *   src          - Primary image URL (required fallback)
 *   srcSmall     - Small variant URL (for mobile / < 768px)
 *   srcLarge     - Large variant URL (for desktop / >= 768px)
 *   srcWebp      - WebP version of src (auto-served by backend)
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
  const imgRef = useRef(null);

  // If the image is already cached/complete on mount, skip the blur
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, []);

  // Determine the best src and build srcset
  const effectiveSrc = srcLarge || srcSmall || src;
  const effectiveAlt = altLarge || altSmall || alt;

  // Build srcset if we have both small and large variants
  const hasSrcSet = srcSmall && srcLarge && srcSmall !== srcLarge;
  const srcSet = hasSrcSet ? `${srcSmall} 480w, ${srcLarge} 1024w` : undefined;
  const effectiveSizes = hasSrcSet
    ? sizes || "(max-width: 768px) 100vw, 50vw"
    : undefined;

  // Build WebP srcset if we have WebP variants
  const hasWebpSrcSet = srcSmallWebp && srcLargeWebp && srcSmallWebp !== srcLargeWebp;
  const webpSrcSet = hasWebpSrcSet
    ? `${srcSmallWebp} 480w, ${srcLargeWebp} 1024w`
    : undefined;
  const effectiveWebpSrc = srcLargeWebp || srcSmallWebp || srcWebp;

  // Do we have any WebP source at all?
  const hasWebp = !!(effectiveWebpSrc || webpSrcSet);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = (e) => {
    setHasError(true);
    if (onError) {
      onError(e);
    } else {
      e.target.src = fallbackSrc;
    }
  };

  const imgProps = {
    ref: imgRef,
    src: effectiveSrc,
    srcSet: srcSet,
    sizes: effectiveSizes,
    alt: effectiveAlt,
    loading: eager ? "eager" : "lazy",
    decoding: eager ? "sync" : "async",
    fetchpriority: eager ? "high" : undefined,
    onLoad: handleLoad,
    onError: handleError,
    onClick: onClick,
    className: `transition-opacity duration-500 ease-in-out ${
      isLoaded ? "opacity-100" : "opacity-0"
    } ${className}`,
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

      {hasWebp ? (
        <picture>
          {/* WebP source — browser picks this if it supports WebP */}
          <source
            type="image/webp"
            srcSet={webpSrcSet || effectiveWebpSrc}
            sizes={effectiveSizes}
          />
          {/* Original format fallback */}
          <img {...imgProps} />
        </picture>
      ) : (
        <img {...imgProps} />
      )}
    </div>
  );
};

export default OptimizedImage;
