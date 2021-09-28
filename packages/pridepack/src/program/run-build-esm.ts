import { BuildResult } from 'esbuild';
import task from 'tasuku';
import buildESMDevelopment from '../core/build-esm-development';
import buildESMProduction from '../core/build-esm-production';
import generateESBuildDiagnostics from './generate-esbuild-diagnostics';

export default async function runBuildESM(
  incremental: boolean,
): Promise<{ dev: BuildResult, prod: BuildResult }> {
  const build = await task('Building ESM files...', async (ctx) => {
    const dev = await ctx.task('Building development...', async ({ setTitle }) => {
      const result = await buildESMDevelopment(incremental);
      generateESBuildDiagnostics(false, result.errors);
      generateESBuildDiagnostics(true, result.warnings);
      setTitle('Built development!');
      return result;
    });
    const prod = await ctx.task('Building production...', async ({ setTitle }) => {
      const result = await buildESMProduction(incremental);
      generateESBuildDiagnostics(false, result.errors);
      generateESBuildDiagnostics(true, result.warnings);
      setTitle('Built production!');
      return result;
    });
    ctx.setTitle('Built ESM files!');

    return { dev: dev.result, prod: prod.result };
  });

  return build.result;
}
