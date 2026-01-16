import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  optimizeDeps: {
    include: ['tesseract.js'],
    esbuildOptions: {
      mainFields: ['module', 'main']
    }
  },
  build: {
    commonjsOptions: {
      include: [/tesseract\.js/, /node_modules/],
      transformMixedEsModules: true
    }
  },
  server: {
    fs: {
      strict: false
    }
  },
  clearScreen: false
})
