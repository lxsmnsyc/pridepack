import execa from 'execa';
import { resolveCJSEntry } from '../core/build-cjs';
import { resolveESMEntry } from '../core/build-esm';
import readPackage from '../core/read-package';
import runTask from './run-task';

export default async function runStartCommand(isDev: boolean): Promise<void> {
  await runTask(async () => {
    const pkg = await readPackage();
    const entrypoint = (
      pkg.type === 'module'
        ? await resolveESMEntry(isDev)
        : await resolveCJSEntry(isDev)
    );
    execa(
      'node',
      [
        entrypoint,
        `NODE_ENV=${isDev ? 'development' : 'production'}`,
        ...process.argv.slice(3),
      ],
    ).stdout?.pipe(process.stdout);
  }, {
    pending: `Starting package in '${isDev ? 'development' : 'production'}' mode...`,
    success: `Started!`,
    failure: `Failed to start package in '${isDev ? 'development' : 'production'}' mode.`
  });
}
