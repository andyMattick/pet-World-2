import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// The game (index.html), the teacher app (teacher.html), and Arcade copies of unit games that share the unit's code
// (arcade/<id>/index.html, served at /arcade/<id>/; docs/ARCADE-GAMES.md).
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        game: resolve(__dirname, 'index.html'),
        teacher: resolve(__dirname, 'teacher.html'),
        powerLab: resolve(__dirname, 'arcade/power-lab/index.html'),
        linkGames: resolve(__dirname, 'arcade/link-games/index.html'),
        bookRepair: resolve(__dirname, 'arcade/book-repair/index.html'),
        sentenceSnap: resolve(__dirname, 'arcade/sentence-snap/index.html')
      }
    }
  }
});
