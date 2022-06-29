import buildESMDevelopment from '../core/build-esm-development';
import buildESMProduction from '../core/build-esm-production';
import { PridepackConfig } from '../core/default-config';
import runESBuild from './run-esbuild';
import { Task } from './run-task';

export default async function runBuildESM(
  config: PridepackConfig,
  incremental: boolean,
): Promise<{ dev: Task<void>, prod: Task<void> }> {
  return {
    dev: await runESBuild(
      (inc) => buildESMDevelopment(config, inc),
      incremental,
      {
        pending: `Building ESM Development output...`,
        success: `Built ESM Development output!`,
        failure: `Failed to build ESM Development output.`,
      },
    ),
    prod: await runESBuild(
      (inc) => buildESMProduction(config, inc),
      incremental,
      {
        pending: `Building ESM Production output...`,
        success: `Built ESM Production output!`,
        failure: `Failed to build ESM Production output.`,
      },
    ),
  };
}
