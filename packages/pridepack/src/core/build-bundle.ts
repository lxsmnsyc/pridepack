import path from 'path';
import { build, BuildResult } from 'esbuild';
import readEnvDefinitions from './read-env-defs';
import readExternals from './read-externals';
import { PridepackConfig } from './default-config';
import getBuildEntrypoints from './get-build-entrypoints';

export default async function buildBundle(
  config: PridepackConfig,
  incremental: boolean,
  isDev: boolean,
  isESM: boolean,
): Promise<BuildResult> {
  const externals = await readExternals();
  const cwd = process.cwd();
  return build({
    entryPoints: getBuildEntrypoints(
      config,
      isESM,
      isDev,
    ),
    outExtension: {
      '.js': config.jsx === 'preserve' ? '.jsx' : '.js',
    },
    outdir: cwd,
    bundle: true,
    minify: !isDev,
    platform: 'neutral',
    format: isESM ? 'esm' : 'cjs',
    sourcemap: isDev,
    define: await readEnvDefinitions(!isDev),
    incremental,
    external: externals,
    target: config.target,
    tsconfig: path.resolve(path.join(cwd, config.tsconfig)),
    jsx: config.jsx,
    jsxFactory: config.jsxFactory,
    jsxFragment: config.jsxFragment,
    logLevel: 'silent',
    charset: 'utf8',
    plugins: (
      typeof config.plugins === 'function'
        ? config.plugins({ isDev, isCJS: !isESM, isESM })
        : config.plugins
    ),
    legalComments: 'eof',
  });
}
