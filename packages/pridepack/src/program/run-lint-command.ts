import prompts from 'prompts';
import task from 'tasuku';
import generateESLintDiagnostics from './generate-eslint-diagnostics';
import runLinter from '../core/run-linter';

export default async function runLintCommand(): Promise<void> {
  const { files } = await prompts({
    type: 'list',
    name: 'files',
    message: 'Which files to lint?',
  });
  const { fix } = await prompts({
    type: 'confirm',
    name: 'fix',
    message: 'Do you want to fix the files?',
  });
  const { cache } = await prompts({
    type: 'confirm',
    name: 'cache',
    message: 'Do you want to only check the changed files?',
  });
  await task('Linting files...', async (ctx) => {
    const result = await runLinter({ files, fix, cache });
    generateESLintDiagnostics(result);
    ctx.setTitle('Linted files!');
  });
}
