import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const proxyTarget = env.VITE_DEV_PROXY;

  return {
    plugins: [react()],
    server: {
      host: true,
      // Dev-only: proxy /api and /media to the backend so the browser stays
      // same-origin. Set VITE_DEV_PROXY to the backend URL and leave
      // VITE_API_BASE_URL empty.
      proxy: proxyTarget
        ? {
            '/api': { target: proxyTarget, changeOrigin: true },
            '/media': { target: proxyTarget, changeOrigin: true },
          }
        : undefined,
    },
  };
});
