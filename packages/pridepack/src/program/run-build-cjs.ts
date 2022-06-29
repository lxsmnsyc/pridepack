import buildCJSDevelopment from '../core/build-cjs-development';
import buildCJSProduction from '../core/build-cjs-production';
import { PridepackConfig } from '../core/default-config';
import runESBuild from './run-esbuild';
import { Task } from './run-task';

export default async function runBuildCJS(
  config: PridepackConfig,
  incremental: boolean,
): Promise<{ dev: Task<void>, prod: Task<void> }> {
  return {
    dev: await runESBuild(
      (inc) => buildCJSDevelopment(config, inc),
      incremental,
      {
        pending: `Building CJS Development output...`,
        success: `Built CJS Development output!`,
        failure: `Failed to build CJS Development output.`,
      },
    ),
    prod: await runESBuild(
      (inc) => buildCJSProduction(config, inc),
      incremental,
      {
        pending: `Building CJS Production output...`,
        success: `Built CJS Production output!`,
        failure: `Failed to build CJS Production output.`,
      },
    ),
  };
}
