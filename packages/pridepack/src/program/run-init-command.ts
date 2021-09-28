import task from 'tasuku';
import copyFromTemplate from '../core/copy-from-template';
import getCWDName from '../core/get-cwd-name';
import chooseTemplate from './choose-template';
import runInitPackage from './run-init-package';
import runInstall from './run-install';

export default async function runInitCommand(): Promise<void> {
  const templateName = await chooseTemplate();
  await task(`Copying from template '${templateName.template}'...`, async (ctx) => {
    await copyFromTemplate(templateName.template, '.');
    ctx.setTitle(`Copied from template '${templateName.template}'!`);
  });
  await runInitPackage(getCWDName());
  await runInstall('.');
}
