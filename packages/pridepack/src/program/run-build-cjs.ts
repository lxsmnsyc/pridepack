import task from 'tasuku';
import { BuildResult } from 'esbuild';
import generateESBuildDiagnostics from './generate-esbuild-diagnostics';
import buildCJSDevelopment from '../core/build-cjs-development';
import buildCJSProduction from '../core/build-cjs-production';

export default async function runBuildCJS(
  incremental: boolean,
): Promise<{ dev: BuildResult, prod: BuildResult }> {
  const build = await task('Building CJS files...', async (ctx) => {
    const dev = await ctx.task('Building development...', async ({ setTitle }) => {
      const result = await buildCJSDevelopment(incremental);
      generateESBuildDiagnostics(false, result.errors);
      generateESBuildDiagnostics(true, result.warnings);
      setTitle('Built development!');
      return result;
    });
    const prod = await ctx.task('Building production...', async ({ setTitle }) => {
      const result = await buildCJSProduction(incremental);
      generateESBuildDiagnostics(false, result.errors);
      generateESBuildDiagnostics(true, result.warnings);
      setTitle('Built production!');
      return result;
    });
    ctx.setTitle('Built CJS files!');
    return { dev: dev.result, prod: prod.result };
  });

  return build.result;
}
