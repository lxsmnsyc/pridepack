import prompts from 'prompts';
import generateESLintDiagnostics from './generate-eslint-diagnostics';
import runLinter from '../core/run-linter';
import runTask from './run-task';
import crash from './graceful-crash';

export default async function runLintCommand(): Promise<void> {
  const { files } = await prompts({
    type: 'list',
    name: 'files',
    message: 'Which files to lint?',
    onState: crash,
  });
  const { fix } = await prompts({
    type: 'confirm',
    name: 'fix',
    message: 'Do you want to fix the files?',
    onState: crash,
  });
  const { cache } = await prompts({
    type: 'confirm',
    name: 'cache',
    message: 'Do you want to only check the changed files?',
    onState: crash,
  });
  const task = await runTask(async (runSuccess) => {
    const result = await runLinter({ files, fix, cache });
    runSuccess();
    generateESLintDiagnostics(result);
  }, {
    pending: 'Linting files...',
    success: 'Linted files!',
    failure: 'Failed to lint files.',
  });
  await task.start();
}
