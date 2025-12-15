import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import Sitemap from 'vite-plugin-sitemap'

// Define all static routes for sitemap
const staticRoutes = [
  '/',
  '/aboutus',
  '/terms',
  '/returnPolicy',
  '/refund',
  '/agentpoints',
  '/offer',
  '/compare-tickets',
  '/login',
  '/registation',
  '/forgot-password',
]

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      hostname: 'https://www.sightseeingroma.com',
      dynamicRoutes: staticRoutes,
      exclude: [
        '/analytics',
        '/yourticket',
        '/profile',
        '/success',
        '/cancel',
        '/checkout',
        '/payment-return',
        '/reset-password',
        '/reset-success',
        '/test',
        '/verify/*',
        '/success/*',
        '/manageBookings/*',
        '/viewsimilar/*',
        '/bus/*',
        '/company-packages/*',
      ],
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: new Date(),
      readable: true,
      robots: [
        { userAgent: '*', allow: '/' },
        { userAgent: '*', disallow: ['/analytics', '/profile', '/yourticket', '/checkout'] },
      ],
    }),
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
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})
