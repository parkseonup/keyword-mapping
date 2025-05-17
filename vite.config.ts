import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      { find: '@entites', replacement: '/src/entites' },
      { find: '@shared', replacement: '/src/shared' },
      { find: '@features', replacement: '/src/features' },
      { find: '@', replacement: '/src' },
    ],
  },
});
