import type { BuildContext, BuildOptions, BuildResult } from 'esbuild';
import { build, context } from 'esbuild';
import path from 'node:path';
import type { PridepackConfig } from './default-config';
import getBuildEntrypoints from './get-build-entrypoints';
import getExtensionJS from './get-extension-js';
import readEnvDefinitions from './read-env-defs';
import readExternals from './read-externals';
import readPackage from './read-package';

export default async function buildBundle(
  config: PridepackConfig,
  incremental: boolean,
  isDev: boolean,
  isESM: boolean,
): Promise<BuildResult | BuildContext> {
  const cwd = process.cwd();
  const externals = await readExternals();
  const pkg = await readPackage();
  const options: BuildOptions = {
    entryPoints: getBuildEntrypoints(config, isESM, isDev),
    outExtension: {
      '.js': getExtensionJS(
        pkg.type === 'module',
        config.jsx === 'preserve',
        isESM,
      ),
    },
    outdir: cwd,
    bundle: true,
    minify: !isDev,
    platform: 'neutral',
    format: isESM ? 'esm' : 'cjs',
    sourcemap: isDev,
    define: await readEnvDefinitions(isDev),
    external: externals,
    target: config.target,
    tsconfig: path.resolve(path.join(cwd, config.tsconfig)),
    jsx: config.jsx,
    jsxFactory: config.jsxFactory,
    jsxFragment: config.jsxFragment,
    jsxImportSource: config.jsxImportSource,
    jsxDev: isDev,
    logLevel: 'silent',
    charset: 'utf8',
    plugins:
      typeof config.plugins === 'function'
        ? config.plugins({ isDev, isCJS: !isESM, isESM })
        : config.plugins,
    legalComments: 'eof',
    metafile: true,
  } as const;

  if (incremental) {
    return context(options);
  }
  return build(options);
}
