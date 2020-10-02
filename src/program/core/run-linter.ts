import { ESLint } from 'eslint';

export interface LintOptions {
  files?: string[];
  fix?: boolean;
  cache?: boolean;
}

export default async function runLinter(
  options: LintOptions,
  defaultPattern: string,
): Promise<ESLint.LintResult[]> {
  const linter = new ESLint({
    fix: options.fix,
    cache: options.cache,
  });

  const results = await linter.lintFiles(options.files || defaultPattern);

  return results;
}
