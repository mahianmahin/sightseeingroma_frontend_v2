import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'
import criticalCSSPlugin from './plugins/vite-plugin-critical-css.js'

// Appends Link: preload headers for critical JS chunks to dist/_headers.
// Only the entry chunk + vendor-react + vendor-router are preloaded:
// these are the only files needed before the first React render.
// Lazy-loaded chunks (Services, FeaturedToday, Contact, Monaco, Stripe etc.)
// are intentionally excluded — preloading them would defeat lazy loading and
// starve the LCP hero image of bandwidth on slow mobile connections.
function netlifyHeadersPlugin() {
  return {
    name: 'netlify-headers',
    closeBundle() {
      const assetsDir = path.resolve(__dirname, 'dist/assets')
      const files = fs.readdirSync(assetsDir)

      // Critical chunks needed for first render — preload these
      const criticalPrefixes = ['index-', 'vendor-react-', 'vendor-router-']
      const criticalFiles = criticalPrefixes
        .map(prefix => files.find(f => f.startsWith(prefix) && f.endsWith('.js')))
        .filter(Boolean)

      if (!criticalFiles.length) return

      // Append to the existing _headers file that Vite copied from public/_headers
      const headersPath = path.resolve(__dirname, 'dist/_headers')
      const linkHeaders = criticalFiles
        .map(f => `  Link: </assets/${f}>; rel=preload; as=script`)
        .join('\n')
      const preloadEntry = `\n# Preload critical JS chunks for faster FCP/LCP\n/\n${linkHeaders}\n`
      fs.appendFileSync(headersPath, preloadEntry)
      console.log(`✅ _headers: preload hints added for:\n  ${criticalFiles.join('\n  ')}`)
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    criticalCSSPlugin(),
    netlifyHeadersPlugin(),
    {
      // Automatically injects a <link rel="modulepreload"> for the main entry chunk
      // into index.html so the browser starts fetching it during HTML parse.
      name: 'auto-preload-main-chunk',
      apply: 'build',
      transformIndexHtml: {
        order: 'pre',
        handler: (html, ctx) => {
          if (!ctx.bundle) return html

          const mainChunk = Object.values(ctx.bundle).find(
            (chunk) =>
              chunk.type === 'chunk' &&
              chunk.isEntry &&
              chunk.fileName.startsWith('index-') &&
              chunk.fileName.endsWith('.js')
          )

          if (!mainChunk) return html

          const preloadLink = `<link rel="modulepreload" href="/${mainChunk.fileName}" fetchpriority="high" crossorigin="anonymous">\n    `

          return html.replace('</head>', preloadLink + '</head>')
        },
      },
    },
  ],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    modulePreload: {
      polyfill: true, // ensures modulepreload works on older browsers too
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Core React runtime — cached long-term, rarely changes
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules/scheduler')) {
            return 'vendor-react'
          }
          // React Router
          if (id.includes('node_modules/react-router') || id.includes('node_modules/@remix-run')) {
            return 'vendor-router'
          }
          // Stripe — large, only needed on checkout
          if (id.includes('node_modules/@stripe')) {
            return 'vendor-stripe'
          }
          // Firebase — large, only needed for auth/analytics
          if (id.includes('node_modules/firebase') || id.includes('node_modules/@firebase')) {
            return 'vendor-firebase'
          }
          // Chart.js — only needed on analytics pages
          if (id.includes('node_modules/chart.js') || id.includes('node_modules/react-chartjs-2')) {
            return 'vendor-charts'
          }
          // Monaco editor — very large, only needed for admin/editing
          if (id.includes('node_modules/monaco-editor') || id.includes('node_modules/@monaco-editor')) {
            return 'vendor-monaco'
          }
          // Syntax highlighter — large, only needed for code display
          if (id.includes('node_modules/react-syntax-highlighter') || id.includes('node_modules/refractor') || id.includes('node_modules/prismjs')) {
            return 'vendor-syntax'
          }
          // Icons — tree-shaken but still significant
          if (id.includes('node_modules/react-icons') || id.includes('node_modules/lucide-react')) {
            return 'vendor-icons'
          }
          // React Helmet (SEO) + DaisyUI/Tailwind runtime
          if (id.includes('node_modules/react-helmet') || id.includes('node_modules/daisyui')) {
            return 'vendor-ui'
          }
        },
      },
    },
  },
})