import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  // Set base path for CDN deployment
  // In production, this should be set to your CDN URL
  base: process.env.VITE_APP_BASE_URL || (process.env.NODE_ENV === 'production' ? 'https://cdn.example.com/' : '/'),
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
          utils: ['axios']
        }
      }
    }
  }
})