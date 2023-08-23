import prompts from 'prompts';
import getSafePackageName from '../core/get-safe-package-name';
import copyFromTemplate from '../core/copy-from-template';
import chooseTemplate from './choose-template';
import runInitPackage from './run-init-package';
import runInstall from './run-install';
import runTask from './run-task';
import crash from './graceful-crash';

export default async function runCreateCommand(): Promise<void> {
  const packageName = await prompts({
    type: 'text',
    name: 'name',
    message: 'What\'s your package name?',
    onState: crash,
  });
  const directory = getSafePackageName(packageName.name);
  const templateName = await chooseTemplate();
  const task = await runTask(async () => copyFromTemplate(templateName.template, directory), {
    pending: `Copying from template '${templateName.template}'...`,
    success: `Copied from template '${templateName.template}'!`,
    failure: `Failed to copy from template '${templateName.template}'.`,
  });
  await task.start();
  await runInitPackage(packageName.name, directory);
  await runInstall(directory);
}
