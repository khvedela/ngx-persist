/// <reference types="vitest" />

import { defineConfig } from 'vite';
import analog from '@analogjs/platform';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  build: {
    target: ['es2020'],
  },
  base: mode === 'production' ? '/ngx-persist/' : '/',
  resolve: {
    mainFields: ['module'],
    alias: {
      'ngx-persist': resolve(__dirname, '../ngx-persist/src/public-api.ts'),
    },
  },
  plugins: [
    tsconfigPaths(),
    analog({
      content: {
        highlighter: 'prism',
      },
      ssr: true,
      static: true,
      prerender: {
        routes: [],
      },
    }),
    tailwindcss()
  ],
}));
// Trigger reload
