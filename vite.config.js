import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: '.', // Project root where index.html is located
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Allows imports like "@/pages/LoginPage"
    },
  },
  build: {
    outDir: 'build', // Output folder for production build
    emptyOutDir: true, // Clears build folder before building
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'), // Ensure Vite finds your index.html
    },
  },
  server: {
    port: 3000, // Optional: dev server port
    open: true, // Opens browser automatically when running dev
  },
});
