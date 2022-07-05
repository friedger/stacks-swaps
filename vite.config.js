import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs/promises';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

export default defineConfig(() => ({
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  plugins: [react({ jsxRuntime: 'automatic' })],
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      // Enable esbuild polyfill plugins

      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
        {
          name: 'load-js-files-as-jsx',
          setup(build) {
            build.onLoad({ filter: /src\/.*\.js$/ }, async args => ({
              loader: 'jsx',
              contents: await fs.readFile(args.path, 'utf8'),
            }));
          },
        },
      ],
    },
  },
}));
