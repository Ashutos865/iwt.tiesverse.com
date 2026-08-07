import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Proxying keeps every browser call same-origin, so CORS never bites in dev
// and the app can ship behind one domain unchanged.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:5000', changeOrigin: true },
      '/uploads': { target: 'http://localhost:5000', changeOrigin: true },
    },
  },
});
