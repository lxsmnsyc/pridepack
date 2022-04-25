import chokidar from 'chokidar';
import runBuildCJS from './run-build-cjs';
import runBuildESM from './run-build-esm';
import generateTSDiagnostics from './generate-ts-diagnostics';
import runTask, { Task } from './run-task';
import readConfig from '../core/read-config';

export default async function runWatchCommand(
  onRebuild?: () => void,
): Promise<void> {
  const config = await readConfig();
  let stop: () => void;
  const task = await runTask(async () => {
    const tasks: Task<void>[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const moduleEntry of Object.keys(config.entrypoints)) {
      const entrypoint = config.entrypoints[moduleEntry];
      const cjs = await runBuildCJS(config, moduleEntry, entrypoint, false);
      const esm = await runBuildESM(config, moduleEntry, entrypoint, false);
      tasks.push(cjs.dev);
      tasks.push(cjs.prod);
      tasks.push(esm.dev);
      tasks.push(esm.prod);
    }

    stop = () => {
      for (let i = 0, len = tasks.length; i < len; i += 1) {
        tasks[i].stop();
      }
    };

    async function rebuild() {
      await Promise.all(tasks.map((currentTask) => currentTask.start()));
    }
    chokidar.watch('.').on('all', (event, path) => {
      console.log(event, path);
    });
    rebuild().then(() => {
      onRebuild?.();
    }).catch((err) => {
      console.error(err);
      process.exit(1);
    });
  }, {
    pending: 'Watch mode starting...',
    success: 'Watching files...',
    failure: 'Watch mode failed.',
  }, {
    onStop() {
      stop();
    },
  });

  await task.start();
}
