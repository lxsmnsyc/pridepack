import prompts from 'prompts';
import task from 'tasuku';
import getSafePackageName from '../core/get-safe-package-name';
import copyFromTemplate from '../core/copy-from-template';
import chooseTemplate from './choose-template';
import runInitPackage from './run-init-package';
import runInstall from './run-install';

export default async function runCreateCommand(): Promise<void> {
  const packageName = await prompts({
    type: 'text',
    name: 'name',
    message: 'What\'s your package name?',
  });
  const directory = getSafePackageName(packageName.name);
  const templateName = await chooseTemplate();
  await task(`Copying from template '${templateName.template}'...`, async (ctx) => {
    await copyFromTemplate(templateName.template, directory);
    ctx.setTitle(`Copied from template '${templateName.template}'!`);
  });
  await runInitPackage(packageName.name, directory);
  await runInstall(directory);
}
