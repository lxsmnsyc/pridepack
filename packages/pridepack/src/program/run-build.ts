import type { BuildResult, BuildContext } from 'esbuild';
import buildBundle from '../core/build-bundle';
import type { PridepackConfig } from '../core/default-config';
import runESBuild from './run-esbuild';
import type { Task } from './run-task';

interface BuildCall {
  (incremental: false): Promise<BuildResult>;
  (incremental: true): Promise<BuildContext>;
}

export default async function runBuild(
  config: PridepackConfig,
  incremental: boolean,
  isDev: boolean,
  isESM: boolean,
): Promise<Task<void>> {
  const format = isESM ? 'ESM' : 'CommonJS';
  const mode = isDev ? 'Development' : 'Production';
  return runESBuild(
    (async (inc) => buildBundle(config, inc, isDev, isESM)) as BuildCall,
    incremental,
    {
      pending: `Building ${format} ${mode} output...`,
      success: `Built ${format} ${mode} output!`,
      failure: `Failed to build ${format} ${mode} output.`,
    },
  );
}
