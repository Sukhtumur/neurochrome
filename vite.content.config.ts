import { defineConfig } from 'vite'
import { resolve } from 'path'

// Separate config for content script - must be IIFE format
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, 'src/content/content-script.ts'),
      name: 'ContentScript',
      formats: ['iife'],
      fileName: () => 'content-script.js',
    },
    rollupOptions: {
      output: {
        extend: true,
        // Inline all dependencies
        inlineDynamicImports: true,
      },
    },
    minify: process.env.NODE_ENV === 'production',
    target: 'esnext',
  },
})
