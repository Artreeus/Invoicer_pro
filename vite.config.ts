import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    // Forward API calls to the Node/MongoDB server during development so the
    // browser can use relative `/api/...` paths without CORS configuration.
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
});
