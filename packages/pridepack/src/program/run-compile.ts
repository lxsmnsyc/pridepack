import generateTSDiagnostics from './generate-ts-diagnostics';
import compileTypes from '../core/compile-types';
import runTask from './run-task';

export default async function runCompile(
  moduleEntry: string,
  entrypoint: string,
  noEmit: boolean,
): Promise<void> {
  const task = await runTask(async (runSuccess) => {
    const result = await compileTypes(entrypoint, noEmit);
    runSuccess();
    generateTSDiagnostics(result);
  }, {
    success: `Compiled types for module entry "${moduleEntry}"!`,
    failure: `Failed to compile types for module entry "${moduleEntry}".`,
    pending: `Compiling types for module entry "${moduleEntry}"...`,
  });
  await task.start();
}
