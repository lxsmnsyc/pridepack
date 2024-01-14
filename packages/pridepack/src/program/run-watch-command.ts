import generateTSDiagnostics from './generate-ts-diagnostics';
import runTask from './run-task';
import readConfig from '../core/read-config';
import watchCompileTypes from '../core/watch-compile-types';
import runBuild from './run-build';

export default async function runWatchCommand(
  onRebuild?: () => void,
): Promise<void> {
  const config = await readConfig();

  let stopTS: () => void;
  const task = await runTask(
    async () => {
      const esmDev = await runBuild(config, true, true, true);
      const esmProd = await runBuild(config, true, false, true);
      const cjsDev = await runBuild(config, true, true, false);
      const cjsProd = await runBuild(config, true, false, false);

      async function rebuild(): Promise<void> {
        await esmDev.start();
        await esmProd.start();
        await cjsDev.start();
        await cjsProd.start();
      }

      stopTS = watchCompileTypes(
        diagnostic => {
          generateTSDiagnostics([diagnostic]);
        },
        () => {
          rebuild()
            .then(() => {
              onRebuild?.();
            })
            .catch(err => {
              console.error(err);
              process.exit(1);
            });
        },
        false,
      );
    },
    {
      pending: 'Watch mode starting...',
      success: 'Watching files...',
      failure: 'Watch mode failed.',
    },
    {
      onStop() {
        stopTS();
      },
    },
  );

  await task.start();
}
