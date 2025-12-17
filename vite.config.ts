import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  optimizeDeps: {
    include: ['tesseract.js'],
    esbuildOptions: {
      mainFields: ['module', 'main'],
    },
  },
  build: {
    commonjsOptions: {
      include: [/tesseract\.js/, /node_modules/],
      transformMixedEsModules: true,
    },
  },
});
