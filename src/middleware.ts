/**
 * ISR Middleware — Incremental Static Regeneration via Workers Cache API
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │                        REQUEST FLOW                                  │
 * │                                                                      │
 * │  Browser ──▶ Middleware ──▶ Workers Cache API ──▶ Astro SSR          │
 * │                                                                      │
 * │  1. HIT   (age < CACHE_MAX_AGE):  Return cached instantly (~0ms)    │
 * │  2. STALE (age < CACHE_STALE_AGE): Return stale + bg revalidate    │
 * │  3. MISS  (no cache / expired):    SSR render → cache → return     │
 * │  4. BYPASS (uncacheable routes):   Always SSR, never cached        │
 * └──────────────────────────────────────────────────────────────────────┘
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │  CONFIGURATION — Edit these two constants to change cache timing:   │
 * │                                                                      │
 * │  CACHE_MAX_AGE  = 3600   ← 1 hour  (fresh, no revalidation)        │
 * │  CACHE_STALE_AGE = 86400 ← 24 hours (stale-while-revalidate)       │
 * │                                                                      │
 * │  To change the "background revalidation time" (how long before      │
 * │  the cache is considered stale and triggers a background refresh):  │
 * │  ➜ Change CACHE_MAX_AGE on line 42.                                │
 * │                                                                      │
 * │  Examples:                                                           │
 * │    300   = 5 minutes  (revalidate every 5 min)                      │
 * │    1800  = 30 minutes                                                │
 * │    3600  = 1 hour     (current default)                              │
 * │    7200  = 2 hours                                                   │
 * └──────────────────────────────────────────────────────────────────────┘
 */

import { defineMiddleware } from 'astro:middleware';

// ═══════════════════════════════════════════════════════════════════════
// MODULE PRELOAD — Eliminates critical request chain
// ═══════════════════════════════════════════════════════════════════════
// This placeholder is replaced AFTER build by src/integrations/modulepreload.mjs
// with the actual transitive dependency URLs. DO NOT rename this constant.
//
// Without modulepreload hints, the browser discovers imports sequentially:
//   MobileNav.js → jsx-runtime.js → react.js → react-dom.js (4 round trips!)
// With modulepreload, the browser fetches ALL JS in parallel (1 round trip).
// ═══════════════════════════════════════════════════════════════════════
const __MODULEPRELOAD_URLS__: string[] = [];

/**
 * Inject <link rel="modulepreload"> tags before </head> in an HTML string.
 * Only called for HTML responses; no-op if there are no preload URLs.
 */
function injectModulePreloads(html: string): string {
  if (__MODULEPRELOAD_URLS__.length === 0) return html;
  const links = __MODULEPRELOAD_URLS__
    .map((url) => `<link rel="modulepreload" href="${url}">`)
    .join('\n');
  return html.replace('</head>', `${links}\n</head>`);
}

// ═══════════════════════════════════════════════════════════════════════
// CONFIGURATION — Change these values to adjust cache behavior
// ═══════════════════════════════════════════════════════════════════════

/**
 * How long (in seconds) a cached page is considered FRESH.
 * During this window, cached HTML is served instantly with zero server work.
 * After this, the next request gets the stale page instantly while a
 * background revalidation refreshes the cache.
 *
 * ➜ THIS IS THE "BACKGROUND REVALIDATION TIME" — change this value.
 *
 * Default: 3600 (1 hour)
 */
const CACHE_MAX_AGE = 3600;

/**
 * How long (in seconds) a STALE cached page can still be served while
 * revalidating in the background. After this window, the cache is fully
 * expired and the next request must wait for a fresh SSR render.
 *
 * Default: 86400 (24 hours)
 */
const CACHE_STALE_AGE = 86400;

// ═══════════════════════════════════════════════════════════════════════

/** Routes that should NEVER be cached (user-specific, transactional, admin) */
const UNCACHEABLE_PREFIXES = [
  '/checkout',
  '/payment-return',
  '/login',
  '/verify/',
  '/success/',
  '/manageBookings/',
  '/analytics',
  '/blog-analytics',
  '/api/',
  '/admin/',
  '/_actions/',
  '/featured-offers', // Admin editor page — always fresh
];

/** HTTP methods that are cacheable */
const CACHEABLE_METHODS = new Set(['GET', 'HEAD']);

// ─── Types ───────────────────────────────────────────────────────────

type CacheStatus = 'HIT' | 'MISS' | 'STALE' | 'UPDATING' | 'BYPASS';

// ─── Helpers ─────────────────────────────────────────────────────────

/**
 * Build a deterministic cache key from the request URL.
 * Includes pathname + sorted query params so ?a=1&b=2 and ?b=2&a=1 hit the same key.
 */
function buildCacheKey(url: URL): string {
  const params = new URLSearchParams(url.searchParams);
  params.sort();
  const normalized = `${url.origin}${url.pathname}${params.toString() ? '?' + params.toString() : ''}`;
  return normalized;
}

/** Check if a pathname should bypass the cache entirely. */
function isUncacheable(pathname: string): boolean {
  return UNCACHEABLE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

/**
 * Attach ISR monitoring headers to a Response.
 * Check these via: curl -sI https://www.sightseeingroma.com/
 */
function withISRHeaders(
  response: Response,
  cacheStatus: CacheStatus,
  cachedAt?: number,
): Response {
  const headers = new Headers(response.headers);

  // Monitoring headers
  headers.set('X-Cache-Status', cacheStatus);
  if (cachedAt) {
    headers.set('X-Cached-At', String(cachedAt));
    headers.set('X-Cache-Age', String(Math.round((Date.now() - cachedAt) / 1000)));
  }

  // Browser should not cache (max-age=0), but CDN/edge should (s-maxage)
  headers.set(
    'Cache-Control',
    `public, max-age=0, s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate=${CACHE_STALE_AGE}`,
  );

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

/**
 * Get the Cloudflare ExecutionContext for waitUntil().
 * The @astrojs/cloudflare adapter exposes it as `locals.cfContext`.
 */
function getExecCtx(locals: App.Locals): { waitUntil: (promise: Promise<any>) => void } | null {
  const ctx = (locals as any)?.cfContext;
  return ctx && typeof ctx.waitUntil === 'function' ? ctx : null;
}

// ─── Middleware ───────────────────────────────────────────────────────

export const onRequest = defineMiddleware(async (context, next) => {
  const { request, url, locals } = context;

  // ── 1. Only cache GET/HEAD to cacheable routes ─────────────────────
  if (!CACHEABLE_METHODS.has(request.method) || isUncacheable(url.pathname)) {
    const response = await next();
    // Still inject modulepreload hints for uncacheable HTML pages
    if (response.ok && response.headers.get('content-type')?.includes('text/html')) {
      const html = injectModulePreloads(await response.text());
      return withISRHeaders(
        new Response(html, {
          status: response.status,
          statusText: response.statusText,
          headers: new Headers(response.headers),
        }),
        'BYPASS',
      );
    }
    return withISRHeaders(response, 'BYPASS');
  }

  // ── 2. Skip ISR for static assets (Cloudflare Assets handles them) ─
  if (
    url.pathname.startsWith('/_astro/') ||
    url.pathname.startsWith('/images/') ||
    url.pathname.startsWith('/fonts/') ||
    /\.(js|css|png|jpg|jpeg|webp|avif|svg|ico|woff2?|ttf|eot)$/.test(url.pathname)
  ) {
    return next();
  }

  // ── 3. Open Workers Cache API ──────────────────────────────────────
  let cache: Cache | null = null;
  try {
    cache = typeof caches !== 'undefined' ? await caches.open('isr:v1') : null;
  } catch {
    cache = null;
  }

  if (!cache) {
    // Graceful degradation: no Cache API → always SSR
    const response = await next();
    return withISRHeaders(response, 'BYPASS');
  }

  // ── 4. Build deterministic cache key ───────────────────────────────
  const cacheKey = buildCacheKey(url);
  const cacheReq = new Request(cacheKey, { method: 'GET' });
  const execCtx = getExecCtx(locals);

  // ── 5. Cache lookup ────────────────────────────────────────────────
  try {
    const cached = await cache.match(cacheReq);

    if (cached) {
      const cachedAt = parseInt(cached.headers.get('X-ISR-Cached-At') || '0', 10);
      const age = (Date.now() - cachedAt) / 1000;

      if (age < CACHE_MAX_AGE) {
        // ── FRESH HIT — instant response, zero server work ─────────
        return withISRHeaders(cached.clone(), 'HIT', cachedAt);
      }

      if (age < CACHE_STALE_AGE) {
        // ── STALE — serve stale instantly, revalidate in background ─
        const revalidation = revalidateAndCache(cache, cacheReq, next);
        if (execCtx) {
          execCtx.waitUntil(revalidation);
        } else {
          revalidation.catch((e) => console.error('[ISR] bg revalidation error:', e));
        }
        return withISRHeaders(cached.clone(), 'STALE', cachedAt);
      }
      // ── EXPIRED (> CACHE_STALE_AGE) — fall through to fresh SSR ──
    }
  } catch (err) {
    console.error('[ISR] Cache read error:', err);
  }

  // ── 6. CACHE MISS — full SSR render, store in cache, return ────────
  try {
    const response = await next();

    // Only cache successful HTML responses
    if (response.ok && response.headers.get('content-type')?.includes('text/html')) {
      // Inject modulepreload hints BEFORE caching so cached HTML already has them
      const originalHtml = await response.text();
      const html = injectModulePreloads(originalHtml);

      const headers = new Headers(response.headers);
      headers.set('X-ISR-Cached-At', String(Date.now()));
      // Workers Cache API uses Cache-Control for its own eviction.
      // Set a long TTL so the Cache API doesn't evict before our stale window expires.
      headers.set('Cache-Control', `public, max-age=${CACHE_STALE_AGE}`);

      const cacheResp = new Response(html, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });

      // Non-blocking cache write
      const putOp = cache.put(cacheReq, cacheResp.clone());
      if (execCtx) {
        execCtx.waitUntil(putOp);
      } else {
        putOp.catch(() => {});
      }

      // Return the preloaded HTML to the user
      return withISRHeaders(
        new Response(html, {
          status: response.status,
          statusText: response.statusText,
          headers: new Headers(response.headers),
        }),
        'MISS',
      );
    }

    return withISRHeaders(response, 'MISS');
  } catch (err) {
    console.error('[ISR] SSR render error:', err);

    // Emergency fallback: serve any stale cache rather than a 500
    try {
      const stale = await cache.match(cacheReq);
      if (stale) {
        const cachedAt = parseInt(stale.headers.get('X-ISR-Cached-At') || '0', 10);
        return withISRHeaders(stale.clone(), 'STALE', cachedAt);
      }
    } catch {}

    throw err;
  }
});

// ─── Background Revalidation ─────────────────────────────────────────

/**
 * Re-render the page via SSR and update the cache.
 * Runs in the background via waitUntil() — the user already got the stale response.
 */
async function revalidateAndCache(
  cache: Cache,
  cacheReq: Request,
  next: () => Promise<Response>,
): Promise<void> {
  try {
    const fresh = await next();

    if (fresh.ok && fresh.headers.get('content-type')?.includes('text/html')) {
      // Inject modulepreload hints into the fresh HTML before caching
      const originalHtml = await fresh.text();
      const html = injectModulePreloads(originalHtml);

      const headers = new Headers(fresh.headers);
      headers.set('X-ISR-Cached-At', String(Date.now()));
      headers.set('Cache-Control', `public, max-age=${CACHE_STALE_AGE}`);

      await cache.put(
        cacheReq,
        new Response(html, { status: fresh.status, statusText: fresh.statusText, headers }),
      );
    }
  } catch (err) {
    console.error('[ISR] Background revalidation failed:', err);
  }
}
