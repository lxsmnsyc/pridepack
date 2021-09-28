import execa from 'execa';
import task from 'tasuku';
import { resolveCJSEntry } from '../core/build-cjs';
import { resolveESMEntry } from '../core/build-esm';
import readPackage from '../core/read-package';

export default async function runStartCommand(isDev: boolean): Promise<void> {
  await task('Starting file...', async (ctx) => {
    const pkg = await readPackage();
    const entrypoint = (
      pkg.type === 'module'
        ? await resolveESMEntry(isDev)
        : await resolveCJSEntry(isDev)
    );
    await execa(
      'node',
      [
        entrypoint,
        `NODE_ENV=${isDev ? 'development' : 'production'}`,
        ...process.argv.slice(3),
      ],
    );
    ctx.setTitle('Started!');
  });
}
