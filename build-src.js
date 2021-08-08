import * as esbuild from 'esbuild';
import packageJSON from './package.json';

esbuild.buildSync({
  entryPoints: [
    './src/index.ts',
  ],
  outfile: './bin/index.js',
  bundle: true,
  minify: true,
  sourcemap: false,
  format: 'esm',
  platform: 'node',
  tsconfig: './tsconfig.json',
  external: [
    ...Object.keys(packageJSON.dependencies),
    ...Object.keys(packageJSON.devDependencies),
  ],
  target: "es2017",
  legalComments: 'eof',
});
