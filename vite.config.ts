import { defineConfig } from 'rolldown-vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-motion';
            }
          }
        },
      },
    },
    // Optimize for production (using esbuild for speed, it's built into Vite)
    minify: 'esbuild',
    // Drop console.log/debugger in production, but keep console.error/warn for debugging
    esbuild: {
      drop: ['debugger'],
      pure: ['console.log', 'console.info', 'console.debug'],
    },
    // Source maps for debugging
    sourcemap: false,
    // Target modern browsers for better optimization
    target: 'es2020',
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion'],
  },
})
