import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import fs from 'fs';

// Get all entry points
const getEntryPoints = () => {
  const entries = {
    'index': 'src/index.ts'
  };
  
  // Add sub-path entries based on package.json exports
  const subPaths = [
    'accounts', 'chains', 'methods', 'methods/wallet', 'methods/wallet/cChain',
    'methods/wallet/pChain', 'methods/wallet/xChain', 'methods/public', 'methods/pChain',
    'methods/admin', 'methods/cChain', 'methods/xChain', 'methods/health',
    'methods/index', 'methods/info', 'node', 'nonce', 'serializable', 'siwe', 'utils', 'window'
  ];
  
  for (const subPath of subPaths) {
    const srcPath = `src/${subPath}/index.ts`;
    try {
      // Check if the file exists
      fs.accessSync(srcPath);
      entries[subPath] = srcPath;
    } catch (e) {
      // File doesn't exist, skip
    }
  }
  
  return entries;
};

const baseConfig = {
  external: [
    // Keep these as external dependencies
    '@avalabs/avalanchejs',
    // '@noble/hashes', // Bundle this ES module dependency
    // '@noble/secp256k1', // Bundle this ES module dependency
    'util',
    'viem',
    // Node.js built-ins
    'crypto',
    'fs',
    'path',
    'url',
    'stream',
    'buffer',
    'events',
    'util',
    'assert',
    'os',
    'child_process',
    'worker_threads'
  ],
  plugins: [
    nodeResolve({
      preferBuiltins: true,
      exportConditions: ['node']
    }),
    commonjs()
  ]
};

export default (commandLineArgs) => {
  const buildFormat = process.env.BUILD_FORMAT || commandLineArgs.environment?.BUILD_FORMAT;
  const entryPoints = getEntryPoints();
  
  if (buildFormat === 'cjs') {
    return Object.entries(entryPoints).map(([name, input]) => ({
      ...baseConfig,
      input,
      output: {
        file: name === 'index' ? `dist/_cjs/index.js` : `dist/_cjs/${name}/index.js`,
        format: 'cjs',
        sourcemap: false,
        exports: 'auto',
        inlineDynamicImports: true
      },
      plugins: [
        ...baseConfig.plugins,
        typescript({
          tsconfig: './tsconfig.cjs.json',
          declaration: false,
          declarationMap: false,
          sourceMap: false,
          exclude: ['**/*.test.ts', '**/*.spec.ts'],
          module: 'esnext',
          target: 'es2020'
        }),
        terser({
          compress: {
            drop_console: true,
            drop_debugger: true
          }
        })
      ]
    }));
  }
  
  if (buildFormat === 'esm') {
    return Object.entries(entryPoints).map(([name, input]) => ({
      ...baseConfig,
      input,
      output: {
        file: name === 'index' ? `dist/_esm/index.js` : `dist/_esm/${name}/index.js`,
        format: 'esm',
        sourcemap: false,
        inlineDynamicImports: true
      },
      plugins: [
        ...baseConfig.plugins,
        typescript({
          tsconfig: './tsconfig.esm.json',
          declaration: false,
          declarationMap: false,
          sourceMap: false,
          exclude: ['**/*.test.ts', '**/*.spec.ts'],
          module: 'esnext',
          target: 'es2020'
        }),
        terser({
          compress: {
            drop_console: true,
            drop_debugger: true
          }
        })
      ]
    }));
  }
  
  // Default: build both formats
  return [
    ...Object.entries(entryPoints).map(([name, input]) => ({
      ...baseConfig,
      input,
      output: {
        file: `dist/_cjs/${name}/index.js`,
        format: 'cjs',
        sourcemap: false,
        exports: 'auto',
        inlineDynamicImports: true
      },
      plugins: [
        ...baseConfig.plugins,
        typescript({
          tsconfig: './tsconfig.cjs.json',
          declaration: false,
          declarationMap: false,
          sourceMap: false,
          exclude: ['**/*.test.ts', '**/*.spec.ts'],
          module: 'esnext',
          target: 'es2020'
        }),
        terser({
          compress: {
            drop_console: true,
            drop_debugger: true
          }
        })
      ]
    })),
    ...Object.entries(entryPoints).map(([name, input]) => ({
      ...baseConfig,
      input,
      output: {
        file: `dist/_esm/${name}/index.js`,
        format: 'esm',
        sourcemap: false,
        inlineDynamicImports: true
      },
      plugins: [
        ...baseConfig.plugins,
        typescript({
          tsconfig: './tsconfig.esm.json',
          declaration: false,
          declarationMap: false,
          sourceMap: false,
          exclude: ['**/*.test.ts', '**/*.spec.ts'],
          module: 'esnext',
          target: 'es2020'
        }),
        terser({
          compress: {
            drop_console: true,
            drop_debugger: true
          }
        })
      ]
    }))
  ];
};
