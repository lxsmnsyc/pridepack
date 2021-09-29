import prompts from 'prompts';
import installDeps from '../core/install-deps';
import runTask from './run-task';

export default async function runInstall(directory: string): Promise<void> {
  const packageManager = await prompts({
    type: 'select',
    name: 'command',
    message: 'Choose your preferred package manager tool',
    choices: [
      { title: 'NPM', value: 'npm' },
      { title: 'Yarn v1 (Legacy)', value: 'yarn' },
      { title: 'PNPM', value: 'pnpm' },
    ],
    initial: 0,
  });
  await runTask(() => installDeps(packageManager.command, directory), {
    pending: `Installing dependencies...`,
    success: `Installed dependencies!`,
    failure: `Failed to install dependencies.`
  });
}
