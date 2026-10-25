import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/robots.txt': {
        target: 'nourbackend.vercel.app',
        changeOrigin: true,
      },
      '/sitemap.xml': {
        target: 'nourbackend.vercel.app',
        changeOrigin: true,
      },
      '/api': {
        target: 'nourbackend.vercel.app',
        changeOrigin: true,
      },
    },
  },
});
