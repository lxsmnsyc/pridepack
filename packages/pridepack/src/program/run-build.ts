import buildBundle from '../core/build-bundle';
import { PridepackConfig } from '../core/default-config';
import runESBuild from './run-esbuild';

export default function runBuild(
  config: PridepackConfig,
  incremental: boolean,
  isDev: boolean,
  isESM: boolean,
) {
  const format = isESM ? 'ESM' : 'CommonJS';
  const mode = isDev ? 'Development' : 'Production';
  return runESBuild(
    (inc) => buildBundle(config, inc, isDev, isESM),
    incremental,
    {
      pending: `Building ${format} ${mode} output...`,
      success: `Built ${format} ${mode} output!`,
      failure: `Failed to build ${format} ${mode} output.`,
    },
  );
}
