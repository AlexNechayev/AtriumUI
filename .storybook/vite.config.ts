import { defineConfig } from 'vite';

/** Isolated Vite app for Storybook — never inherit the HA lib build. */
export default defineConfig({
  server: {
    fs: {
      allow: ['..'],
    },
  },
});
