import { confirm, text } from '@clack/prompts';
import generateESLintDiagnostics from './generate-eslint-diagnostics';
import runLinter from '../core/run-linter';
import runTask from './run-task';
import stopProgram from './stop-program';

interface LintOptions {
  file?: string;
  fix?: boolean;
  cache?: boolean;
}

export default async function runLintCommand(options: LintOptions): Promise<void> {
  const file = options.file ?? await text({
    message: 'Which files to lint?',
    placeholder: 'src/**',
  });
  if (stopProgram(file)) {
    return;
  }
  const fix = options.fix ?? await confirm({
    message: 'Do you want to fix the files?',
  });
  if (stopProgram(fix)) {
    return;
  }
  const cache = options.cache ?? await confirm({
    message: 'Do you want to only check the changed files?',
  });
  if (stopProgram(cache)) {
    return;
  }
  const task = runTask(async (runSuccess) => {
    const result = await runLinter({ file, fix, cache });
    runSuccess();
    generateESLintDiagnostics(result);
  }, {
    pending: 'Linting files...',
    success: 'Linted files!',
    failure: 'Failed to lint files.',
  });
  await task.start();
}
