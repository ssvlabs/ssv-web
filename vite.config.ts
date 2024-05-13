import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import path from 'path';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig(({ mode }) => {
  return {
    publicDir: 'public',
    build: {
      outDir: 'build'
    },
    plugins: [
      react(),
      nodePolyfills({
        globals: {
          Buffer: mode === 'production'
        }
      })
    ],
    define:
      mode === 'development'
        ? {
            global: {}
          }
        : undefined,
    resolve: {
      alias: {
        '~app': path.resolve('./src/app'),
        '~lib': path.resolve('./src/lib'),
        '~root': path.resolve('./src'),
        '~config': path.resolve('./config'),
        '~images': path.resolve('./src/images'),
        '~redux': path.resolve('./src/redux/*')
      }
    }
  };
});
