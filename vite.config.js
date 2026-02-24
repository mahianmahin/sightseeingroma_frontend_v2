import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
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
