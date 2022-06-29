import runBuildCJS from './run-build-cjs';
import runBuildESM from './run-build-esm';
import generateTSDiagnostics from './generate-ts-diagnostics';
import runTask from './run-task';
import readConfig from '../core/read-config';
import watchCompileTypes from '../core/watch-compile-types';

export default async function runWatchCommand(
  onRebuild?: () => void,
): Promise<void> {
  const config = await readConfig();

  let stopTS: () => void;
  const task = await runTask(async () => {
    const cjs = await runBuildCJS(config, true);
    const esm = await runBuildESM(config, true);

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
        rebuild().then(() => {
          onRebuild?.();
        }).catch((err) => {
          console.error(err);
          process.exit(1);
        });
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
