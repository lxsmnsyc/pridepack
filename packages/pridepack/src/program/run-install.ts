import { select } from '@clack/prompts';
import installDeps from '../core/install-deps';
import runTask from './run-task';
import stopProgram from './stop-program';

export default async function runInstall(directory: string): Promise<void> {
  const packageManager = await select({
    message: 'Choose your preferred package manager tool',
    options: [
      { label: 'NPM', value: 'npm' },
      { label: 'Yarn v1 (Legacy)', value: 'yarn' },
      { label: 'PNPM', value: 'pnpm' },
    ],
    initialValue: 'npm',
  });
  if (stopProgram(packageManager)) {
    return;
  }
  const task = runTask(() => installDeps(packageManager, directory), {
    pending: 'Installing dependencies...',
    success: 'Installed dependencies!',
    failure: 'Failed to install dependencies.',
  });
  await task.start();
}
