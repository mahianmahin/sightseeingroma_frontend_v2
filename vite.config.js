import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'
import criticalCSSPlugin from './plugins/vite-plugin-critical-css.js'

// Appends Link: preload headers for critical JS chunks to dist/_headers.
// For the homepage (/), we preload the full render chain:
//   entry → vendor-react → vendor-router → Home → vendor-icons
// This eliminates sequential round-trips and lets the browser download
// everything in parallel via Netlify Early Hints (103).
// Lazy-loaded below-fold chunks are intentionally excluded.
function netlifyHeadersPlugin() {
  return {
    name: 'netlify-headers',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist')
      const assetsDir = path.resolve(distDir, 'assets')
      const files = fs.readdirSync(assetsDir)

      // Find the actual entry chunk from index.html (not just any index-* file)
      const htmlPath = path.resolve(distDir, 'index.html')
      const html = fs.readFileSync(htmlPath, 'utf-8')
      const entryMatch = html.match(/src="\/assets\/(index-[^"]+\.js)"/)
      const entryFile = entryMatch ? entryMatch[1] : files.find(f => f.startsWith('index-') && f.endsWith('.js'))

      // Critical vendor chunks for React bootstrapping
      const vendorFiles = ['vendor-react-', 'vendor-router-']
        .map(prefix => files.find(f => f.startsWith(prefix) && f.endsWith('.js')))
        .filter(Boolean)

      // Homepage render chain — Home chunk + its sync dependencies
      const homeChainPrefixes = ['Home-', 'vendor-icons-']
      const homeChainFiles = homeChainPrefixes
        .map(prefix => files.find(f => f.startsWith(prefix) && f.endsWith('.js')))
        .filter(Boolean)

      // Main CSS file
      const cssFile = files.find(f => f.startsWith('index-') && f.endsWith('.css'))

      const allCritical = [entryFile, ...vendorFiles, ...homeChainFiles].filter(Boolean)

      if (!allCritical.length) return

      // Append to the existing _headers file that Vite copied from public/_headers
      const headersPath = path.resolve(distDir, '_headers')
      const jsLinks = allCritical
        .map(f => `  Link: </assets/${f}>; rel=preload; as=script`)
        .join('\n')
      const cssLink = cssFile
        ? `\n  Link: </assets/${cssFile}>; rel=preload; as=style`
        : ''
      const preloadEntry = `\n# Preload critical JS + CSS for faster FCP/LCP\n/\n${jsLinks}${cssLink}\n`
      fs.appendFileSync(headersPath, preloadEntry)
      console.log(`✅ _headers: preload hints added for:\n  ${allCritical.join('\n  ')}${cssFile ? '\n  ' + cssFile : ''}`)
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