import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// Two pages: the game (index.html) and the teacher app (teacher.html).
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        game: resolve(__dirname, 'index.html'),
        teacher: resolve(__dirname, 'teacher.html')
      }
    }
  }
});
