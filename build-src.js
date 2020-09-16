const esbuild = require('esbuild');
const packageJSON = require('./package.json');

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
  external: Object.keys(packageJSON.dependencies),
});
