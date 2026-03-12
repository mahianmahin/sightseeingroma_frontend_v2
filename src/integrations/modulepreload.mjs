/**
 * Astro Integration: Auto Module Preload
 *
 * After each build, this integration:
 * 1. Scans built HTML + SSR chunks for island script references
 * 2. Traces their transitive ES module imports from the built JS chunks
 * 3. Patches the compiled middleware to embed the modulepreload URLs
 *
 * The middleware then injects <link rel="modulepreload"> tags into every
 * HTML response, so the browser fetches ALL JS dependencies in parallel
 * instead of discovering them sequentially across 4+ round trips.
 *
 * This eliminates the "critical request chain" Lighthouse warning entirely.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Parse ES module imports from a built JS file.
 * Handles both: from"./chunk.js" and from "./chunk.js"
 * Also handles: import("./chunk.js") for dynamic imports
 */
function getImports(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const staticImports = content.match(/from\s*["']\.\/([^"']+)["']/g) || [];
    const dynamicImports = content.match(/import\s*\(\s*["']\.\/([^"']+)["']\s*\)/g) || [];
    const all = [...staticImports, ...dynamicImports];
    return all.map((m) => {
      // Extract filename from patterns like: from"./chunk.js" or import("./chunk.js")
      const match = m.match(/["']\.\/([^"']+)["']/);
      return match ? match[1] : null;
    }).filter(Boolean);
  } catch {
    return [];
  }
}

/**
 * Recursively collect all transitive dependencies of a JS file.
 */
function collectAllDeps(filename, dir, visited = new Set()) {
  if (visited.has(filename)) return visited;
  visited.add(filename);
  const imports = getImports(path.join(dir, filename));
  for (const imp of imports) {
    collectAllDeps(imp, dir, visited);
  }
  return visited;
}

/**
 * Scan content for astro-island component-url and renderer-url attributes.
 * Also find <script type="module" src="/_astro/..."> tags.
 */
function findIslandEntryPoints(content) {
  const urls = new Set();

  // component-url="/_astro/Something.hash.js"
  const componentUrls = content.match(/component-url="([^"]+)"/g) || [];
  for (const match of componentUrls) {
    const url = match.replace('component-url="', '').replace('"', '');
    urls.add(url);
  }

  // renderer-url="/_astro/client.hash.js"
  const rendererUrls = content.match(/renderer-url="([^"]+)"/g) || [];
  for (const match of rendererUrls) {
    const url = match.replace('renderer-url="', '').replace('"', '');
    urls.add(url);
  }

  return [...urls];
}

export default function modulePreloadIntegration() {
  return {
    name: 'astro-modulepreload',
    hooks: {
      'astro:build:done': async ({ dir, pages, logger }) => {
        const clientDir = path.join(fileURLToPath(dir), '_astro');
        const serverDir = path.resolve(fileURLToPath(dir), '..', 'server');
        const htmlDir = fileURLToPath(dir);

        // ── Step 1: Collect entry points from built HTML + SSR chunks ──

        const allEntryPoints = new Set();

        // Scan all static HTML files
        function scanDir(dirPath) {
          try {
            const entries = fs.readdirSync(dirPath, { withFileTypes: true });
            for (const entry of entries) {
              const fullPath = path.join(dirPath, entry.name);
              if (entry.isDirectory() && entry.name !== '_astro') {
                scanDir(fullPath);
              } else if (entry.name.endsWith('.html')) {
                const html = fs.readFileSync(fullPath, 'utf8');
                for (const ep of findIslandEntryPoints(html)) {
                  allEntryPoints.add(ep);
                }
              }
            }
          } catch {}
        }
        scanDir(htmlDir);

        // Scan SSR server chunks (for pages with prerender=false)
        try {
          const chunksDir = path.join(serverDir, 'chunks');
          const serverChunks = fs.readdirSync(chunksDir);
          for (const chunk of serverChunks) {
            if (!chunk.endsWith('.mjs')) continue;
            const content = fs.readFileSync(path.join(chunksDir, chunk), 'utf8');
            for (const ep of findIslandEntryPoints(content)) {
              allEntryPoints.add(ep);
            }
          }
        } catch {}

        if (allEntryPoints.size === 0) {
          logger.info('No island entry points found — skipping modulepreload.');
          return;
        }

        logger.info(`Found ${allEntryPoints.size} island entry points:`);
        for (const ep of allEntryPoints) {
          logger.info(`  → ${ep}`);
        }

        // ── Step 2: Trace all transitive dependencies ──

        const allDeps = new Set();
        for (const entryUrl of allEntryPoints) {
          const filename = entryUrl.replace(/^\/_astro\//, '');
          const deps = collectAllDeps(filename, clientDir);
          for (const dep of deps) {
            allDeps.add(dep);
          }
        }

        // Remove entry points — they're already in the HTML as <script> tags
        for (const entryUrl of allEntryPoints) {
          allDeps.delete(entryUrl.replace(/^\/_astro\//, ''));
        }

        const preloadUrls = [...allDeps].sort().map((dep) => `/_astro/${dep}`);

        logger.info(`Modulepreload: ${preloadUrls.length} transitive dependencies to preload:`);
        for (const url of preloadUrls) {
          logger.info(`  → ${url}`);
        }

        // ── Step 3: Write manifest for debugging ──

        const manifest = {
          generated: new Date().toISOString(),
          entryPoints: [...allEntryPoints].sort(),
          preload: preloadUrls,
        };

        const clientManifestPath = path.join(htmlDir, 'modulepreload-manifest.json');
        fs.writeFileSync(clientManifestPath, JSON.stringify(manifest, null, 2));
        logger.info(`Wrote manifest: ${clientManifestPath}`);

        // ── Step 4: Inject modulepreload into prerendered HTML files ──

        let htmlFilesPatched = 0;
        const preloadTags = preloadUrls
          .map((url) => `<link rel="modulepreload" href="${url}">`)
          .join('\n');

        function injectIntoHtmlFiles(dirPath) {
          try {
            const entries = fs.readdirSync(dirPath, { withFileTypes: true });
            for (const entry of entries) {
              const fullPath = path.join(dirPath, entry.name);
              if (entry.isDirectory() && entry.name !== '_astro') {
                injectIntoHtmlFiles(fullPath);
              } else if (entry.name.endsWith('.html')) {
                let html = fs.readFileSync(fullPath, 'utf8');
                if (html.includes('</head>') && !html.includes('modulepreload')) {
                  html = html.replace('</head>', `${preloadTags}\n</head>`);
                  fs.writeFileSync(fullPath, html);
                  htmlFilesPatched++;
                }
              }
            }
          } catch {}
        }
        injectIntoHtmlFiles(htmlDir);
        logger.info(`Injected modulepreload into ${htmlFilesPatched} static HTML files`);

        // ── Step 5: Patch compiled middleware for SSR pages ──
        //
        // The middleware has: const __MODULEPRELOAD_URLS__ = [];
        // We replace the empty array with the actual URLs so it works at runtime
        // on Cloudflare Workers (no filesystem access).

        const middlewarePath = path.join(serverDir, 'virtual_astro_middleware.mjs');
        try {
          let middlewareCode = fs.readFileSync(middlewarePath, 'utf8');

          // The compiled middleware will have: const __MODULEPRELOAD_URLS__ = [];
          // Replace the empty array with the actual URLs
          const urlsArrayLiteral = JSON.stringify(preloadUrls);
          const replaced = middlewareCode.replace(
            /const\s+__MODULEPRELOAD_URLS__\s*=\s*\[\s*\]/,
            `const __MODULEPRELOAD_URLS__ = ${urlsArrayLiteral}`,
          );

          if (replaced !== middlewareCode) {
            fs.writeFileSync(middlewarePath, replaced);
            logger.info(`Patched middleware with ${preloadUrls.length} modulepreload URLs`);
          } else {
            logger.warn(
              'Could not find __MODULEPRELOAD_URLS__ placeholder in compiled middleware. ' +
              'Make sure src/middleware.ts has: const __MODULEPRELOAD_URLS__: string[] = [];',
            );
          }
        } catch (err) {
          logger.error(`Failed to patch middleware: ${err.message}`);
        }
      },
    },
  };
}
