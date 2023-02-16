import { text } from '@clack/prompts';
import { builtinModules } from 'module';
import getSafePackageName from '../core/get-safe-package-name';
import copyFromTemplate from '../core/copy-from-template';
import chooseTemplate from './choose-template';
import runInitPackage from './run-init-package';
import runInstall from './run-install';
import runTask from './run-task';
import stopProgram from './stop-program';

const blocklist = new Set([
  'node_modules',
  'favicon.io',
  ...builtinModules,
]);

interface CreateOptions {
  name?: string;
  template?: string;
}

export default async function runCreateCommand(
  options: CreateOptions,
): Promise<void> {
  const packageName = options.name ?? await text({
    message: 'What\'s your package name?',
    placeholder: 'my-package',
    validate(value) {
      if (value.length < 0 || value.length > 214) {
        return 'package name length must be between 0 and 214';
      }
      if (blocklist.has(value.toLowerCase())) {
        return 'package name must not be reserved/blocklisted';
      }
      if (
        /^(@[a-z0-9][a-z0-9-_.]+\/)?[a-z0-9][a-z0-9-_.]+$/.test(value)
        && encodeURIComponent(value) === value
      ) {
        return undefined;
      }
      return 'package name is not valid.';
    },
  });
  if (stopProgram(packageName)) {
    return;
  }
  const directory = getSafePackageName(packageName);
  const templateName = options.template ?? await chooseTemplate();
  if (stopProgram(templateName)) {
    return;
  }
  const task = runTask(() => copyFromTemplate(templateName, directory), {
    pending: `Copying from template '${templateName}'...`,
    success: `Copied from template '${templateName}'!`,
    failure: `Failed to copy from template '${templateName}'.`,
  });
  await task.start();
  await runInitPackage(packageName, directory);
  await runInstall(directory);
}
