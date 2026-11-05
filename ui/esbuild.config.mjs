import { build } from 'esbuild';

await build({
  entryPoints: ['src/plugin.tsx'],
  outfile: '../plugin/desktop/plugin.js',
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2022',
  jsx: 'automatic',
  jsxImportSource: 'react',
  external: ['@hermes/plugin-sdk', 'react', 'react/jsx-runtime'],
  legalComments: 'none',
  sourcemap: false,
  minify: true,
  logLevel: 'info'
});
