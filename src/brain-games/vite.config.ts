import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    base: './',   // served from /brain-games/ inside Pet World
    plugins: [react(), tailwindcss()],
    build: {
      // `npm run build` writes straight into Pet World's public folder
      outDir: path.resolve(__dirname, '../../public/brain-games'),
      emptyOutDir: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
