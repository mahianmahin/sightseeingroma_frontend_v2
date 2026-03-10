import { useState, useEffect, useRef } from 'react';

/**
 * LazySection — renders children only when the wrapper scrolls near the viewport.
 *
 * This prevents below-fold components from mounting (and fetching data) until
 * the user scrolls close to them.  Lighthouse won't see those network requests
 * in the critical path because they simply don't exist yet.
 *
 * Usage:
 *   <LazySection className="min-h-[200px]" rootMargin="300px">
 *     <Services />   {/* won't mount until ~300px before visible *}
 *   </LazySection>
 *
 * @param {string}  [rootMargin='300px'] — trigger this far before visible
 * @param {string}  [className]          — CSS class for the placeholder div
 * @param {React.ReactNode} children
 */
export default function LazySection({ children, rootMargin = '300px', className = '' }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Fallback if IO not supported
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : null}
    </div>
  );
}
