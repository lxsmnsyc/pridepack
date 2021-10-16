import chalk from 'chalk';
import execa from 'execa';
import { resolveCJSEntry } from '../core/build-cjs';
import { resolveESMEntry } from '../core/build-esm';
import readPackage from '../core/read-package';
import runTask from './run-task';
import runWatchCommand from './run-watch-command';

export default async function runStartCommand(isDev: boolean): Promise<void> {
  const task = await runTask(async () => {
    const pkg = await readPackage();
    const entrypoint = (
      pkg.type === 'module'
        ? await resolveESMEntry(isDev)
        : await resolveCJSEntry(isDev)
    );

    function startProcess() {
      console.log(chalk.yellow('Restarting...'));
      const instance = execa(
        'node',
        [
          entrypoint,
          `NODE_ENV=${isDev ? 'development' : 'production'}`,
          ...process.argv.slice(3),
        ],
      );
      instance.stdout?.pipe(process.stdout);
      console.log(chalk.green('Restarted!'));
      return instance;
    }

    let instance: execa.ExecaChildProcess<string> | undefined;

    if (isDev) {
      await runWatchCommand(() => {
        if (instance) {
          instance.cancel();
        }
        instance = startProcess();
      });
    }
  }, {
    pending: `Starting package in '${isDev ? 'development' : 'production'}' mode...`,
    success: `Started in '${isDev ? 'development' : 'production'}' mode!`,
    failure: `Failed to start package in '${isDev ? 'development' : 'production'}' mode.`,
  });

  await task.start();
}
