import path from 'path';
import copyFromTemplate from '../core/copy-from-template';
import chooseTemplate from './choose-template';
import runInitPackage from './run-init-package';
import runInstall from './run-install';
import runTask from './run-task';
import stopProgram from './stop-program';

interface InitOptions {
  template?: string;
}

export default async function runInitCommand(options: InitOptions): Promise<void> {
  const templateName = options.template ?? await chooseTemplate();
  if (stopProgram(templateName)) {
    return;
  }
  const task = runTask(() => copyFromTemplate(templateName, '.'), {
    pending: `Copying from template '${templateName}'...`,
    success: `Copied from template '${templateName}'!`,
    failure: `Failed to copy from template '${templateName}'.`,
  });
  await task.start();
  await runInitPackage(path.basename(path.resolve(process.cwd())));
  await runInstall('.');
}
