import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    base: './',   // served from /arcade/mine-walker/ inside Pet Town
    plugins: [react(), tailwindcss()],
    build: {
      // `npm run build` writes straight into Pet Town's public folder
      outDir: path.resolve(__dirname, '../../../public/arcade/mine-walker'),
      emptyOutDir: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
