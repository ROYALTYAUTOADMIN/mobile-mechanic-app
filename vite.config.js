// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: process.cwd(), // current working directory
  base: '/', // base path for assets
  build: {
    outDir: 'build', // output folder for production build
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'), // entry point
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // optional: allows import from '@/components/...'
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
