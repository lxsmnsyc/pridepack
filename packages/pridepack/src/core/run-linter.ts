import { ESLint } from 'eslint';

export interface LintOptions {
  file?: string;
  fix?: boolean;
  cache?: boolean;
}

export default async function runLinter(
  options: LintOptions,
): Promise<ESLint.LintResult[]> {
  const linter = new ESLint({
    fix: options.fix,
    cache: options.cache,
  });

  const results = await linter.lintFiles(options.file ?? '');

  return results;
}
