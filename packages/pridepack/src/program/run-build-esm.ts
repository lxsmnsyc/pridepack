import buildESMDevelopment from '../core/build-esm-development';
import buildESMProduction from '../core/build-esm-production';
import { PridepackConfig } from '../core/default-config';
import runESBuild from './run-esbuild';
import { Task } from './run-task';

export default async function runBuildESM(
  config: PridepackConfig,
  moduleEntry: string,
  entrypoint: string,
  incremental: boolean,
): Promise<{ dev: Task<void>, prod: Task<void> }> {
  return {
    dev: await runESBuild(
      (inc) => buildESMDevelopment(config, moduleEntry, entrypoint, inc),
      incremental,
      {
        pending: `Building ESM Development output for module entry "${moduleEntry}"...`,
        success: `Built ESM Development output for module entry "${moduleEntry}"!`,
        failure: `Failed to build ESM Development output for module entry "${moduleEntry}".`,
      },
    ),
    prod: await runESBuild(
      (inc) => buildESMProduction(config, moduleEntry, entrypoint, inc),
      incremental,
      {
        pending: `Building ESM Production output for module entry "${moduleEntry}"...`,
        success: `Built ESM Production output for module entry "${moduleEntry}"!`,
        failure: `Failed to build ESM Production output for module entry "${moduleEntry}".`,
      },
    ),
  };
}
