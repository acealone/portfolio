import { defineConfig } from 'vite';

export default defineConfig({
  base: '/portfolio/',
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
});
