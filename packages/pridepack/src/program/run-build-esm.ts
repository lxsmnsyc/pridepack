import buildESMDevelopment from '../core/build-esm-development';
import buildESMProduction from '../core/build-esm-production';
import runESBuild from './run-esbuild';
import { Task } from './run-task';

export default async function runBuildESM(
  incremental: boolean,
): Promise<{ dev: Task<void>, prod: Task<void> }> {
  return {
    dev: await runESBuild(buildESMDevelopment, incremental, {
      pending: 'Building ESM Development output...',
      success: 'Built ESM Development output!',
      failure: 'Failed to build ESM Development output.',
    }),
    prod: await runESBuild(buildESMProduction, incremental, {
      pending: 'Building ESM Production output...',
      success: 'Built ESM Production output!',
      failure: 'Failed to build ESM Production output.',
    }),
  };
}
