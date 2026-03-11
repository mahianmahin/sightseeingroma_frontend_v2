import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Adapter selection:
//   - @astrojs/node: universal, works on any Node.js host (Netlify, Render, Railway, Docker)
//   - @astrojs/cloudflare: for Cloudflare Pages (currently blocked by picomatch CJS bug in Workerd)
//   - No adapter needed for `astro dev`
const isProd = process.argv.includes('build') || process.argv.includes('preview');

export default defineConfig({
  // Astro 6: 'static' is the default. Per-page SSR opt-in with `export const prerender = false`.
  output: 'static',
  ...(isProd && { adapter: node({ mode: 'standalone' }) }),

  integrations: [
    react(),
  ],

  site: 'https://www.sightseeingroma.com',

  vite: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        // Replace react-router-dom with our lightweight shim for Astro islands
        'react-router-dom': path.resolve(__dirname, './src/lib/router-shim.jsx'),
        // Replace react-helmet-async with no-op (SEO handled by Astro layouts)
        'react-helmet-async': path.resolve(__dirname, './src/lib/helmet-shim.jsx'),
      },
    },
    ssr: {
      external: ['node:buffer', 'node:crypto'],
    },
  },
});
