import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolve } from 'path'
import sveltePreprocess from 'svelte-preprocess'
import { copyFileSync, mkdirSync } from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: 'public',
  plugins: [
    svelte({
      preprocess: sveltePreprocess(),
    }),
    // Custom plugin to move index.html to popup folder
    {
      name: 'move-html',
      closeBundle() {
        const srcPath = resolve(__dirname, 'dist/src/popup/index.html')
        const destPath = resolve(__dirname, 'dist/popup/index.html')
        try {
          mkdirSync(resolve(__dirname, 'dist/popup'), { recursive: true })
          copyFileSync(srcPath, destPath)
        } catch (err) {
          console.warn('Could not move index.html:', err)
        }
      },
    },
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: false, // Don't delete manifest.json and icons
    sourcemap: process.env.NODE_ENV === 'development',
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/index.html'),
        background: resolve(__dirname, 'src/background/background.ts'),
        // content-script built separately with vite.content.config.ts
      },
      output: {
        format: 'es',
        entryFileNames: (chunkInfo) => {
          // Keep specific names for entry points
          if (chunkInfo.name === 'background') {
            return 'background.js'
          }
          if (chunkInfo.name === 'content-script') {
            return 'content-script.js'
          }
          return 'assets/[name]-[hash].js'
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          // Keep CSS and other assets organized
          if (assetInfo.name === 'popup.css') {
            return 'popup.css'
          }
          if (assetInfo.name === 'index.html') {
            return 'popup/index.html'
          }
          return 'assets/[name]-[hash][extname]'
        },
        // Inline everything for content-script
        inlineDynamicImports: false,
        manualChunks: (id) => {
          // Force content script and its dependencies into a single file
          if (id.includes('content-script') || 
              (id.includes('src') && !id.includes('background') && !id.includes('popup'))) {
            return undefined // Don't split content script
          }
        },
      },
    },
    minify: process.env.NODE_ENV === 'production',
    target: 'esnext',
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['dexie'],
  },
})
