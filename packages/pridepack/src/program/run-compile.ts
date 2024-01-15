import generateTSDiagnostics from './generate-ts-diagnostics';
import compileTypes from '../core/compile-types';
import runTask from './run-task';
import readConfig from '../core/read-config';

export default async function runCompile(noEmit: boolean): Promise<void> {
  const config = await readConfig();
  const task = await runTask(
    async runSuccess => {
      const result = await compileTypes(config, noEmit);
      runSuccess();
      generateTSDiagnostics(result);
    },
    {
      success: 'Compiled types!',
      failure: 'Failed to compile types.',
      pending: 'Compiling types...',
    },
  );
  await task.start();
}
