import execa from 'execa';
import {
  getCJSTargetDirectory,
  getESMTargetDirectory,
} from '../core/resolve-entrypoint';
import { green, yellow } from '../core/colors';
import readPackage from '../core/read-package';
import runTask from './run-task';
import runWatchCommand from './run-watch-command';
import readConfig from '../core/read-config';

export default async function runStartCommand(isDev: boolean): Promise<void> {
  const config = await readConfig();
  const task = await runTask(async () => {
    const pkg = await readPackage();
    const entrypoint = (
      pkg.type === 'module'
        ? getESMTargetDirectory(config, config.startEntrypoint ?? '.', isDev)
        : getCJSTargetDirectory(config, config.startEntrypoint ?? '.', isDev)
    );

    function startProcess() {
      const instance = execa(
        'node',
        [
          entrypoint,
          `NODE_ENV=${isDev ? 'development' : 'production'}`,
          ...process.argv.slice(3),
        ],
      );
      instance.stdout?.pipe(process.stdout);
      return instance;
    }

    let instance: execa.ExecaChildProcess<string> | undefined;

    if (isDev) {
      await runWatchCommand(() => {
        const isRestarting = !!instance;
        if (instance) {
          instance.cancel();
          console.log(yellow('Restarting...'));
        }
        instance = startProcess();
        if (isRestarting) {
          console.log(green('Restarted!'));
        }
      });
    } else {
      await startProcess();
    }
  }, {
    pending: `Starting package in '${isDev ? 'development' : 'production'}' mode...`,
    success: `Started in '${isDev ? 'development' : 'production'}' mode!`,
    failure: `Failed to start package in '${isDev ? 'development' : 'production'}' mode.`,
  });

  await task.start();
}
