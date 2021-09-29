import { BuildResult } from 'esbuild';
import buildCJSDevelopment from '../core/build-cjs-development';
import buildCJSProduction from '../core/build-cjs-production';
import runESBuild from './run-esbuild';


export default async function runBuildCJS(
  incremental: boolean,
): Promise<{ dev: BuildResult, prod: BuildResult }> {
  const results = await Promise.all([
    runESBuild(() => buildCJSDevelopment(incremental), {
      pending: 'Building CJS Development output...',
      success: 'Built CJS Development output!',
      failure: 'Failed to build CJS Development output.',
    }),
    runESBuild(() => buildCJSProduction(incremental), {
      pending: 'Building CJS Production output...',
      success: 'Built CJS Production output!',
      failure: 'Failed to build CJS Production output.',
    }),
  ]);
  return {
    dev: results[0],
    prod: results[1],
  };
}
