import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Vite plugin to pre-compile CJS deps that break in workerd (Cloudflare runtime)
function precompileCJSPlugin() {
  return {
    name: 'precompile-cjs-for-workerd',
    configEnvironment(environment) {
      if (environment !== 'client') {
        return {
          optimizeDeps: {
            include: [
              'picomatch',
              '@astrojs/internal-helpers > picomatch',
            ],
          },
        };
      }
    },
  };
}

export default defineConfig({
  // Astro 6: 'static' is the default. Per-page SSR opt-in with `export const prerender = false`.
  output: 'static',
  adapter: cloudflare({
    imageService: 'passthrough', // Cloudflare Images binding requires a paid plan
  }),

  // Inline all CSS into <style> tags in <head> to eliminate render-blocking stylesheet requests.
  // The full CSS is ~22 KiB gzipped — small enough to inline without hurting HTML size.
  build: {
    inlineStylesheets: 'always',
  },

  integrations: [
    react(),
  ],

  site: 'https://www.sightseeingroma.com',

  vite: {
    plugins: [precompileCJSPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        // Replace react-router-dom with our lightweight shim for Astro islands
        'react-router-dom': path.resolve(__dirname, './src/lib/router-shim.jsx'),
        // Replace react-helmet-async with no-op (SEO handled by Astro layouts)
        'react-helmet-async': path.resolve(__dirname, './src/lib/helmet-shim.jsx'),
      },
    },
  },
});
