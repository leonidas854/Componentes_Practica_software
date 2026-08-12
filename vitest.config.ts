import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
// @ts-ignore: testing-library does not export types for /vite yet
import { svelteTesting } from '@testing-library/svelte/vite';

export default defineConfig({
  plugins: [svelte(), svelteTesting()],
  resolve: {
    alias: {
      $lib: '/home/leonidas/deveploment/Componentes_Practica_software/src/lib'
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTest.ts'],
    include: ['src/**/*.{test,spec}.{js,ts}'],
    pool: 'forks'
  }
});
