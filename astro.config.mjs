import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Cloudflare adapter crashes in dev (Workerd CJS compat issue).
// Only attach it for build/preview.
const isProd = process.argv.includes('build') || process.argv.includes('preview');

export default defineConfig({
  // Astro 6: 'static' is the default. Per-page SSR opt-in with `export const prerender = false`.
  output: 'static',
  ...(isProd && { adapter: cloudflare() }),

  integrations: [
    react(),
  ],

  site: 'https://www.sightseeingroma.com',

  vite: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    ssr: {
      external: ['node:buffer', 'node:crypto'],
    },
  },
});
