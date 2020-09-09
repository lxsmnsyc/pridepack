import { Listr } from 'listr2';
import { ESLint } from 'eslint';
import measureTask from '../utils/measure-task';

interface LintOptions {
  files: string[];
  fix: boolean;
  cache: boolean;
}

async function runLinter(options: Partial<LintOptions>, defaultPattern: string) {
  const linter = new ESLint({
    fix: options.fix,
    cache: options.cache,
  });

  const results = await linter.lintFiles(options.files || defaultPattern);

  // 4. Format the results.
  const formatter = await linter.loadFormatter('stylish');
  const resultText = formatter.format(results);

  console.log(resultText);
}

export default function lint(options: Partial<LintOptions>): void {
  measureTask(new Listr([
    {
      title: 'Running ESLint',
      task: () => {
        if (options.files) {
          return new Listr([
            {
              title: 'Running ESLint with pattern',
              task: () => runLinter(options, ''),
            },
          ]);
        }
        return new Listr([
          {
            title: 'Running ESLint for source directory',
            task: () => runLinter(options, 'src'),
          },
          {
            title: 'Running ESLint for test directory',
            task: () => runLinter(options, 'test'),
          },
        ]);
      },
    },
  ], { rendererOptions: { collapse: false } }));
}
