const esbuild = require('esbuild');

esbuild.buildSync({
  entryPoints: [
    './src/index.ts',
  ],
  outfile: './bin/index.js',
  bundle: true,
  minify: true,
  sourcemap: true,
  platform: 'node',
  tsconfig: './tsconfig.json',
  external: [
    "dotenv",
    "esbuild",
    "fs-extra",
    "tslib",
    "typescript",
    "yargs"
  ],
});
