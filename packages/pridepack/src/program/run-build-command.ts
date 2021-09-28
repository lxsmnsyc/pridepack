import task from 'tasuku';
import runBuildCJS from './run-build-cjs';
import runBuildESM from './run-build-esm';
import generateTSDiagnostics from './generate-ts-diagnostics';
import compileTypes from '../core/compile-types';

export default async function runBuildCommand(): Promise<void> {
  await runBuildCJS(false);
  await runBuildESM(false);
  await task('Compiling types...', async (ctx) => {
    const result = await compileTypes(false);
    generateTSDiagnostics(result);
    ctx.setTitle('Compiled types!');
  });
}
