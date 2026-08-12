import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
// @ts-ignore: testing-library aún no publica tipos para /vite
import { svelteTesting } from '@testing-library/svelte/vite';

export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        // Mismo modo "runes" que usa la aplicación (ver vite.config.ts).
        runes: ({ filename }) =>
          filename.split(/[/\\]/).includes('node_modules') ? undefined : true
      }
    }),
    svelteTesting()
  ],
  resolve: {
    alias: {
      $lib: fileURLToPath(new URL('./src/lib', import.meta.url))
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTest.ts'],
    include: ['src/**/*.{test,spec}.{js,ts}'],
    pool: 'forks'
  }
});
