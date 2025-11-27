import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  // Set base path for production deployment
  // In production, this should use the environment variable or default to '/'
  base: process.env.VITE_APP_BASE_URL || '/',
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ],
  build: {
    // Optimize for CDN deployment
    rollupOptions: {
      output: {
        // Separate vendor chunks for better caching
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          utils: ['axios'],
          charts: ['recharts'],
          socket: ['socket.io-client'],
          forms: ['react-hook-form'],
          notifications: ['react-toastify']
        }
      }
    },
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Minify JavaScript and CSS
    minify: 'esbuild', // Use esbuild instead of terser
    // Enable gzip compression
    brotliSize: true,
    // Chunk size warning limit
    chunkSizeWarningLimit: 1000
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: []
  }
})