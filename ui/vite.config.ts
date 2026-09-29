import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { externalizeDeps } from 'vite-plugin-externalize-deps';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    externalizeDeps(),
    dts({
      insertTypesEntry: true,
      exclude: ['**/*.test.*', '**/*.stories.*', 'vitest.config.ts'],
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        wallet: resolve(__dirname, 'src/wallet/index.ts'),
        transfer: resolve(__dirname, 'src/transfer/index.ts'),
        theme: resolve(__dirname, 'src/styles/theme.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'react', 
        'react-dom', 
        '@avalanche-sdk/client', 
        'viem'
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
    cssCodeSplit: false,
  },
  css: {
    postcss: './postcss.config.js',
  },
});
