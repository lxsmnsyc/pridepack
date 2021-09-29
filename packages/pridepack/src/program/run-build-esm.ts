import { BuildResult } from 'esbuild';
import buildESMDevelopment from '../core/build-esm-development';
import buildESMProduction from '../core/build-esm-production';
import runESBuild from './run-esbuild';


export default async function runBuildESM(
  incremental: boolean,
): Promise<{ dev: BuildResult, prod: BuildResult }> {
  const results = await Promise.all([
    runESBuild(() => buildESMDevelopment(incremental), {
      pending: 'Building ESM Development output...',
      success: 'Built ESM Development output!',
      failure: 'Failed to build ESM Development output.',
    }),
    runESBuild(() => buildESMProduction(incremental), {
      pending: 'Building ESM Production output...',
      success: 'Built ESM Production output!',
      failure: 'Failed to build ESM Production output.',
    }),
  ]);
  return {
    dev: results[0],
    prod: results[1],
  };
}
