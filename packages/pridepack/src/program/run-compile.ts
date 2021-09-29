import generateTSDiagnostics from './generate-ts-diagnostics';
import compileTypes from '../core/compile-types';
import runTask from './run-task';

export default async function runCompile(noEmit: boolean): Promise<void> {
  await runTask(async () => {
    const result = await compileTypes(noEmit);
    generateTSDiagnostics(result);
  }, {
    success: 'Compiled types!',
    failure: 'Failed to compile types.',
    pending: 'Compiling types...',
  });
}
