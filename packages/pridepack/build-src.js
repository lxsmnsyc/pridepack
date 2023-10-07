import { build } from "esbuild";
import fs from 'fs/promises';

const packageJSON = JSON.parse(await fs.readFile('./package.json', 'utf-8'));

await build({
  entryPoints: [
    './src/index.ts',
  ],
  outfile: './bin/index.mjs',
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
  target: "es2018",
  legalComments: 'eof',
});
