/**
 * Cache Purge API Endpoint
 *
 * POST /api/purge-cache
 *
 * Purges the ISR cache for specific URLs or all cached pages.
 * Protected by a secret token to prevent unauthorized purges.
 *
 * Usage:
 *   # Purge homepage
 *   curl -X POST https://www.sightseeingroma.com/api/purge-cache \
 *     -H "Content-Type: application/json" \
 *     -H "Authorization: Bearer YOUR_SECRET" \
 *     -d '{"urls": ["/"]}'
 *
 *   # Purge multiple pages
 *   curl -X POST https://www.sightseeingroma.com/api/purge-cache \
 *     -H "Content-Type: application/json" \
 *     -H "Authorization: Bearer YOUR_SECRET" \
 *     -d '{"urls": ["/", "/blogs", "/company-packages/bigbus"]}'
 *
 *   # Purge ALL cached pages
 *   curl -X POST https://www.sightseeingroma.com/api/purge-cache \
 *     -H "Content-Type: application/json" \
 *     -H "Authorization: Bearer YOUR_SECRET" \
 *     -d '{"purgeAll": true}'
 *
 * Set the PURGE_SECRET environment variable in Cloudflare dashboard (Workers > Settings > Variables).
 * If PURGE_SECRET is not set, the endpoint is disabled for security.
 */

import type { APIRoute } from 'astro';

export const prerender = false;

// Common pages to purge when purgeAll is requested
const COMMON_PAGES = [
  '/',
  '/blogs',
  '/compare-tickets',
  '/offer',
];

export const POST: APIRoute = async ({ request, url }) => {
  // ── 1. Check if Cache API is available ─────────────────────────────
  let cache: Cache | null = null;
  try {
    cache = typeof caches !== 'undefined' ? await caches.open('isr:v1') : null;
  } catch {
    return new Response(
      JSON.stringify({ error: 'Cache API not available' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } },
    );
  }

  if (!cache) {
    return new Response(
      JSON.stringify({ error: 'Cache API not available' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } },
    );
  }

  // ── 2. Verify authorization ────────────────────────────────────────
  const purgeSecret = (import.meta.env.PURGE_SECRET || '').trim();
  if (!purgeSecret) {
    return new Response(
      JSON.stringify({ error: 'PURGE_SECRET not configured. Set it in Cloudflare environment variables.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const authHeader = request.headers.get('Authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (token !== purgeSecret) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } },
    );
  }

  // ── 3. Parse request body ──────────────────────────────────────────
  let body: { urls?: string[]; purgeAll?: boolean };
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON body. Expected: { "urls": ["/", "/blogs"] } or { "purgeAll": true }' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  // ── 4. Build list of URLs to purge ─────────────────────────────────
  const origin = url.origin;
  let urlsToPurge: string[] = [];

  if (body.purgeAll) {
    urlsToPurge = COMMON_PAGES.map((path) => `${origin}${path}`);
  } else if (Array.isArray(body.urls) && body.urls.length > 0) {
    urlsToPurge = body.urls.map((path) => {
      if (path.startsWith('http')) return path;
      return `${origin}${path.startsWith('/') ? path : '/' + path}`;
    });
  } else {
    return new Response(
      JSON.stringify({ error: 'Provide "urls" array or set "purgeAll": true' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  // ── 5. Purge each URL from cache ───────────────────────────────────
  const results: { url: string; deleted: boolean }[] = [];

  for (const fullUrl of urlsToPurge) {
    try {
      const deleted = await cache.delete(new Request(fullUrl, { method: 'GET' }));
      results.push({ url: fullUrl, deleted });
    } catch {
      results.push({ url: fullUrl, deleted: false });
    }
  }

  return new Response(
    JSON.stringify({
      success: true,
      purged: results.filter((r) => r.deleted).length,
      total: results.length,
      results,
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    },
  );
};

// Block GET requests with a helpful message
export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({ error: 'Use POST method to purge cache. See source for usage.' }),
    { status: 405, headers: { 'Content-Type': 'application/json', 'Allow': 'POST' } },
  );
};
