import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

// When building straight into a Home Assistant `www` folder (typically a
// Samba/SMB network mount via `dev:ha`), we must NOT empty the out-dir or emit
// sourcemaps: deleting/writing `atrium-ui.js.map` over SMB intermittently fails
// with "Resource busy" because the share holds a lock on the file, which aborts
// the watch rebuild. Overwriting the single bundle in place avoids that.
const haBuild = process.env.HA_BUILD === '1';

// AtriumUI ships as a single, self-contained ES module that Home Assistant loads
// as a Lovelace resource (e.g. /local/atrium-ui/atrium-ui.js?v=0.0.1). Lit is
// intentionally bundled in (not externalized) so no mixed dependencies leak in.
export default defineConfig({
  build: {
    target: 'es2021',
    minify: 'esbuild',
    sourcemap: !haBuild,
    emptyOutDir: !haBuild,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: () => 'atrium-ui.js',
    },
    rollupOptions: {
      // Force everything into one tree-shaken chunk (no code splitting).
      output: {
        inlineDynamicImports: true,
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['test/**/*.test.ts'],
  },
});
