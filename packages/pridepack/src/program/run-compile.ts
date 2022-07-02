import generateTSDiagnostics from './generate-ts-diagnostics';
import compileTypes from '../core/compile-types';
import runTask from './run-task';
import { PridepackConfig } from '../core/default-config';

export default async function runCompile(
  config: PridepackConfig,
  noEmit: boolean,
): Promise<void> {
  const task = await runTask(async (runSuccess) => {
    const result = await compileTypes(config, noEmit);
    runSuccess();
    generateTSDiagnostics(result);
  }, {
    success: 'Compiled types!',
    failure: 'Failed to compile types.',
    pending: 'Compiling types...',
  });
  await task.start();
}
