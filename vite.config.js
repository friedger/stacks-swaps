import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs/promises';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import AutoImport from 'unplugin-auto-import/vite';

export default defineConfig(() => ({
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
    jsxInject: `import React from 'react'`,
  },
  build: {
    target: 'esnext',
    outDir: 'build',
  },
  plugins: [
    react({
      include: /\.[tj]sx?$/,
    }),
  ],
  optimizeDeps: {
    include: ['react/jsx-runtime'],
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
