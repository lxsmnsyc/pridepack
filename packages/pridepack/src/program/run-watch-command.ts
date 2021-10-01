import runBuildCJS from './run-build-cjs';
import runBuildESM from './run-build-esm';
import generateTSDiagnostics from './generate-ts-diagnostics';
import watchCompileTypes from '../core/watch-compile-types';
import runTask from './run-task';

export default async function runWatchCommand(
  onRebuild?: () => void,
): Promise<void> {
  let stopTS: () => void;
  const task = await runTask(async () => {
    const cjs = await runBuildCJS(true);
    const esm = await runBuildESM(true);

    async function rebuild() {
      await cjs.dev.start();
      await cjs.prod.start();
      await esm.dev.start();
      await esm.prod.start();
    }

    stopTS = watchCompileTypes(
      (diagnostic) => {
        generateTSDiagnostics([diagnostic]);
      },
      () => {
        rebuild().catch(console.error);
        onRebuild?.();
      },
      false,
    );
  }, {
    pending: 'Watch mode starting...',
    success: 'Watching files...',
    failure: 'Watch mode failed.',
  }, {
    onStop() {
      stopTS();
    },
  });

  await task.start();
}
