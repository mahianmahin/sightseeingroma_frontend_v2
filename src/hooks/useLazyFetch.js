import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useLazyFetch — delays a fetch until the component scrolls into the viewport.
 *
 * WHY: `requestIdleCallback` and even `window.load` fire too early — Lighthouse
 *      still counts those API calls in the critical-path waterfall.
 *      IntersectionObserver ensures the fetch only starts when the user can
 *      actually SEE the component (or is about to — using rootMargin).
 *
 * USAGE:
 *   const { data, loading, error, containerRef } = useLazyFetch(url);
 *   return <div ref={containerRef}>...</div>;
 *
 * The `containerRef` MUST be attached to the component's outermost wrapper
 * so the observer can detect when it enters the viewport.
 *
 * @param {string}  url           – API endpoint to fetch
 * @param {object}  [options]     – extra options
 * @param {string}  [options.rootMargin='200px'] – trigger fetch this far before visible
 * @param {boolean} [options.skip=false]         – skip fetching entirely
 * @returns {{ data, loading, error, containerRef }}
 */
export default function useLazyFetch(url, { rootMargin = '200px', skip = false } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);
  const hasFetched = useRef(false);

  const doFetch = useCallback(async () => {
    if (hasFetched.current || skip || !url) return;
    hasFetched.current = true;
    setLoading(true);
    try {
      const res = await fetch(url);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(`useLazyFetch error (${url}):`, err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [url, skip]);

  useEffect(() => {
    if (skip || hasFetched.current) return;

    const node = containerRef.current;

    // Fallback: if IntersectionObserver not supported, fetch after load
    if (!node || typeof IntersectionObserver === 'undefined') {
      const onLoad = () => doFetch();
      if (document.readyState === 'complete') {
        doFetch();
      } else {
        window.addEventListener('load', onLoad, { once: true });
        return () => window.removeEventListener('load', onLoad);
      }
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          doFetch();
        }
      },
      { rootMargin } // e.g. '200px' triggers 200px before visible
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [doFetch, rootMargin, skip]);

  return { data, loading, error, containerRef };
}
