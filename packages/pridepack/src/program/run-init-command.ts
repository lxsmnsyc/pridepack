import copyFromTemplate from '../core/copy-from-template';
import getCWDName from '../core/get-cwd-name';
import sleep from '../core/sleep';
import chooseTemplate from './choose-template';
import runInitPackage from './run-init-package';
import runInstall from './run-install';
import runTask from './run-task';

export default async function runInitCommand(): Promise<void> {
  const templateName = await chooseTemplate();
  await runTask(() => copyFromTemplate(templateName.template, '.'), {
    pending: `Copying from template '${templateName.template}'...`,
    success: `Copied from template '${templateName.template}'!`,
    failure: `Failed to copy from template '${templateName.template}'.`
  });
  await sleep(100);
  await runInitPackage(getCWDName());
  await runInstall('.');
}
