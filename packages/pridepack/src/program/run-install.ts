import prompts from 'prompts';
import task from 'tasuku';
import installDeps from '../core/install-deps';

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
    initial: 1,
  });
  await task('Installing dependencies...', async (ctx) => {
    await installDeps(packageManager.command, directory);
    ctx.setTitle('Installed dependencies!');
  });
}
