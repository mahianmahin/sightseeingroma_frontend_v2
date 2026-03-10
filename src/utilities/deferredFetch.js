/**
 * deferredFetch — fetch that waits until the page `load` event has fired.
 *
 * Problem:  requestIdleCallback fires the instant the browser has a tiny idle
 *           gap (often < 100 ms after first paint), so using it to "defer" API
 *           calls doesn't actually defer anything — they still compete with
 *           hero-image / LCP bandwidth on slow connections.
 *
 * Solution: Wait for `window.load` (all critical resources like hero image are
 *           done), then batch the actual fetch.  A per-URL in-flight cache
 *           de-duplicates identical URLs so Footer, Services, Contact etc.
 *           don't each fire their own /packages/ or /website-settings/ request.
 *
 * Usage:
 *   import { deferredFetch } from '../../utilities/deferredFetch';
 *   const data = await deferredFetch('https://api.sightseeingroma.com/packages/');
 */

// In-flight + resolved cache keyed by URL
const cache = new Map();

// Resolves once the page `load` event has fired
let loadPromise;
if (typeof window !== 'undefined') {
  if (document.readyState === 'complete') {
    // Already loaded (e.g. SPA navigation after initial load)
    loadPromise = Promise.resolve();
  } else {
    loadPromise = new Promise((resolve) => {
      window.addEventListener('load', resolve, { once: true });
    });
  }
} else {
  loadPromise = Promise.resolve();
}

/**
 * Fetch a URL, but only after the `load` event.
 * Identical URLs are de-duplicated (only one network request).
 *
 * @param {string} url
 * @param {RequestInit} [opts]
 * @returns {Promise<Response>}  – a *cloned* Response so each caller can .json() independently
 */
export async function deferredFetch(url, opts) {
  // Wait for page load first — hero image, critical CSS, entry JS all done
  await loadPromise;

  const key = url;

  if (!cache.has(key)) {
    // Store the in-flight promise so subsequent callers reuse it
    cache.set(
      key,
      fetch(url, opts).then((res) => {
        // Cache the parsed JSON so we don't need to clone Responses
        // (cloning streams is fragile; JSON caching is simpler).
        return res.json().then((json) => {
          cache.set(key, { resolved: true, json });
          return json;
        });
      }).catch((err) => {
        cache.delete(key);  // allow retry on failure
        throw err;
      })
    );
  }

  const cached = cache.get(key);

  // Already resolved — return cached JSON directly
  if (cached && cached.resolved) {
    return cached.json;
  }

  // Still in-flight — wait for it
  return cached;
}

/**
 * Convenience: deferredFetchJSON — same as deferredFetch but returns parsed JSON.
 * (deferredFetch already returns JSON, this is just an alias for clarity.)
 */
export const deferredFetchJSON = deferredFetch;
