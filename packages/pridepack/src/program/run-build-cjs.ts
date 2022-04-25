import buildCJSDevelopment from '../core/build-cjs-development';
import buildCJSProduction from '../core/build-cjs-production';
import { PridepackConfig } from '../core/default-config';
import runESBuild from './run-esbuild';
import { Task } from './run-task';

export default async function runBuildCJS(
  config: PridepackConfig,
  moduleEntry: string,
  entrypoint: string,
  incremental: boolean,
): Promise<{ dev: Task<void>, prod: Task<void> }> {
  return {
    dev: await runESBuild(
      (inc) => buildCJSDevelopment(config, moduleEntry, entrypoint, inc),
      incremental,
      {
        pending: `Building CJS Development output for module entry "${moduleEntry}"...`,
        success: `Built CJS Development output for module entry "${moduleEntry}"!`,
        failure: `Failed to build CJS Development output for module entry "${moduleEntry}".`,
      },
    ),
    prod: await runESBuild(
      (inc) => buildCJSProduction(config, moduleEntry, entrypoint, inc),
      incremental,
      {
        pending: `Building CJS Production output for module entry "${moduleEntry}"...`,
        success: `Built CJS Production output for module entry "${moduleEntry}"!`,
        failure: `Failed to build CJS Production output for module entry "${moduleEntry}".`,
      },
    ),
  };
}
