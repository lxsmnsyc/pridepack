import chalk from 'chalk';
import { Message } from 'esbuild';
import { ESLint, Linter } from 'eslint';
import path from 'path';
import prompts from 'prompts';
import task from 'tasuku';
import ts from 'typescript';
import buildCJSDevelopment from './program/core/build-cjs-development';
import buildCJSProduction from './program/core/build-cjs-production';
import buildESMDevelopment from './program/core/build-esm-development';
import buildESMProduction from './program/core/build-esm-production';
import clean from './program/core/clean';
import compileTypes from './program/core/compile-types';
import copyFromTemplate from './program/core/copy-from-template';
import createPackage from './program/core/create-package';
import getCWDName from './program/core/get-cwd-name';
import getSafePackageName from './program/core/get-safe-package-name';
import installDeps from './program/core/install-deps';
import patchPackage from './program/core/patch-package';
import runLinter from './program/core/run-linter';
import runJest from './program/core/run-jest';
import watchCompileTypes from './program/core/watch-compile-types';

interface DiagnosticDisplay {
  symbol: string;
  color: typeof chalk.Color;
}

interface DiagnosticDisplayOptions {
  [key: string]: DiagnosticDisplay;
}

export const DIAGNOSTIC_DISPLAYS: DiagnosticDisplayOptions = {
  [ts.DiagnosticCategory.Error]: {
    symbol: '✖',
    color: 'red',
  },
  [ts.DiagnosticCategory.Message]: {
    symbol: '✔',
    color: 'green',
  },
  [ts.DiagnosticCategory.Suggestion]: {
    symbol: 'ℹ',
    color: 'cyan',
  },
  [ts.DiagnosticCategory.Warning]: {
    symbol: '⚠',
    color: 'yellow',
  },
};

function createDiagnosticMessage(
  category: ts.DiagnosticCategory,
  message: string,
): void {
  const display = DIAGNOSTIC_DISPLAYS[category];
  console.log(`${chalk.keyword(display.color)(display.symbol)} ${message}`);
}

function createEsbuildDiagnosticString(message: Message): string {
  const baseMessage = message.text;
  if (message.location) {
    const { location } = message;
    const file = chalk.blue(location.file);
    const line = chalk.yellow(location.line);
    const column = chalk.yellow(location.column + 1);
    return `${file} (${line}, ${column}): ${baseMessage}`;
  }

  return baseMessage;
}

function generateESBuildDiagnostics(isWarning: boolean, messages: Message[]): void {
  for (let i = 0, len = messages.length; i < len; i += 1) {
    createDiagnosticMessage(
      isWarning ? ts.DiagnosticCategory.Warning : ts.DiagnosticCategory.Error,
      createEsbuildDiagnosticString(messages[i]),
    );
  }
}

function createTSDiagnosticString(diagnostic: ts.Diagnostic): string {
  const baseMessage = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
  if (diagnostic.file && diagnostic.start) {
    const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
    const fileName = path.relative(process.cwd(), diagnostic.file.fileName);
    const file = chalk.blue(fileName);
    const styledLine = chalk.yellow(line + 1);
    const column = chalk.yellow(character + 1);
    return `${file} (${styledLine}, ${column}): ${baseMessage}`;
  }

  return baseMessage;
}

function generateTSDiagnostics(messages: ts.Diagnostic[]): void {
  for (let i = 0, len = messages.length; i < len; i += 1) {
    createDiagnosticMessage(
      messages[i].category,
      createTSDiagnosticString(messages[i]),
    );
  }
}

type SeverityMap = Record<Linter.Severity, ts.DiagnosticCategory>;

const diagnostics: SeverityMap = {
  0: ts.DiagnosticCategory.Message,
  1: ts.DiagnosticCategory.Warning,
  2: ts.DiagnosticCategory.Error,
};

function createESLintString(message: Linter.LintMessage): string {
  const baseMessage = message.message;
  const rule = chalk.blue(message.ruleId ? ` [${message.ruleId}]` : '');
  const line = chalk.yellow(message.line);
  const column = chalk.yellow(message.column);
  return `(${line}, ${column}): ${baseMessage}${rule}`;
}

function generateESLintDiagnostics(results: ESLint.LintResult[]): void {
  for (let r = 0, rlen = results.length; r < rlen; r += 1) {
    const result = results[r];
    console.log(path.relative(process.cwd(), result.filePath));
    for (let i = 0, len = result.messages.length; i < len; i += 1) {
      const message = result.messages[i];
      createDiagnosticMessage(
        diagnostics[message.severity],
        createESLintString(message),
      );
    }
  }
}

const TEMPLATES = [
  'basic',
  'react',
  'preact',
  'vue',
  'fastify',
  'bot-discord',
];

async function chooseTemplate() {
  return prompts({
    type: 'select',
    name: 'template',
    message: 'Choose your template',
    choices: Object.keys(TEMPLATES).map((item) => ({
      title: item,
      value: item,
    })),
    initial: 0,
  });
}

async function runInstallCommand(directory: string) {
  const packageManager = await prompts({
    type: 'select',
    name: 'command',
    message: 'Choose your preferred package manager tool',
    choices: [
      { title: 'NPM', value: 'npm' },
      { title: 'Yarn v1 (Legacy)', value: 'yarn' },
      { title: 'PNPM', value: 'pnpm' },
    ],
    initial: 1,
  });
  await task('Installing dependencies...', async (ctx) => {
    await installDeps(packageManager.command, directory);
    ctx.setTitle('Installed dependencies!');
  });
}

async function runCreateCommand() {
  const packageName = await prompts({
    type: 'text',
    name: 'name',
    message: 'What\'s your package name?',
  });
  const directory = getSafePackageName(packageName.name);
  const templateName = await chooseTemplate();
  await task(`Copying from template '${templateName.template as string}'...`, async (ctx) => {
    await copyFromTemplate(templateName.template, directory);
    ctx.setTitle(`Copied from template '${templateName.template as string}'!`);
  });
  await patchPackage(directory, packageName.name);
  await runInstallCommand(directory);
}

async function runInitCommand() {
  await task('Generating package.json...', async (ctx) => {
    await createPackage(getCWDName(), '.');
    ctx.setTitle('Generated package.json!');
  });
  const templateName = await chooseTemplate();
  await task(`Copying from template '${templateName.template as string}'...`, async (ctx) => {
    await copyFromTemplate(templateName.template, '.');
    ctx.setTitle(`Copied from template '${templateName.template as string}'!`);
  });
  await patchPackage();
  await runInstallCommand('.');
}

async function runCleanCommand() {
  await task('Cleaning build directory...', async (ctx) => {
    await clean();
    ctx.setTitle('Cleaned!');
  });
}

async function runCJS(incremental: boolean) {
  const build = await task('Building CJS files...', async (ctx) => {
    const dev = await ctx.task('Building development...', async ({ setTitle }) => {
      const result = await buildCJSDevelopment(incremental);
      generateESBuildDiagnostics(false, result.errors);
      generateESBuildDiagnostics(true, result.warnings);
      setTitle('Built development!');
      return result;
    });
    const prod = await ctx.task('Building production...', async ({ setTitle }) => {
      const result = await buildCJSProduction(incremental);
      generateESBuildDiagnostics(false, result.errors);
      generateESBuildDiagnostics(true, result.warnings);
      setTitle('Built production!');
      return result;
    });
    ctx.setTitle('Built CJS files!');
    return { dev: dev.result, prod: prod.result };
  });

  return build.result;
}

async function runESM(incremental: boolean) {
  const build = await task('Building ESM files...', async (ctx) => {
    const dev = await ctx.task('Building development...', async ({ setTitle }) => {
      const result = await buildESMDevelopment(incremental);
      generateESBuildDiagnostics(false, result.errors);
      generateESBuildDiagnostics(true, result.warnings);
      setTitle('Built development!');
      return result;
    });
    const prod = await ctx.task('Building production...', async ({ setTitle }) => {
      const result = await buildESMProduction(incremental);
      generateESBuildDiagnostics(false, result.errors);
      generateESBuildDiagnostics(true, result.warnings);
      setTitle('Built production!');
      return result;
    });
    ctx.setTitle('Built ESM files!');

    return { dev: dev.result, prod: prod.result };
  });

  return build.result;
}

async function runBuildCommand() {
  await runCJS(false);
  await runESM(false);
  await task('Compiling types...', async (ctx) => {
    const result = await compileTypes(false);
    generateTSDiagnostics(result);
    ctx.setTitle('Compiled types!');
  });
}

async function runCheckCommand() {
  await task('Compiling types...', async (ctx) => {
    const result = await compileTypes(true);
    generateTSDiagnostics(result);
    ctx.setTitle('Compiled types!');
  });
}

async function runLintCommand() {
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

async function runWatchCommand(): Promise<() => void> {
  const cjs = await runCJS(true);
  const esm = await runESM(true);

  const stopTS = watchCompileTypes(
    (diagnostic) => {
      createDiagnosticMessage(
        diagnostic.category,
        createTSDiagnosticString(diagnostic),
      );
    },
    () => {
      Promise.all([
        cjs.dev.rebuild(),
        cjs.prod.rebuild(),
        esm.dev.rebuild(),
        esm.prod.rebuild(),
      ]).then(([cjsDev, cjsProd, esmDev, esmProd]) => {
        generateESBuildDiagnostics(false, cjsDev.warnings);
        generateESBuildDiagnostics(true, cjsDev.warnings);
        generateESBuildDiagnostics(false, cjsProd.warnings);
        generateESBuildDiagnostics(true, cjsProd.warnings);
        generateESBuildDiagnostics(false, esmDev.warnings);
        generateESBuildDiagnostics(true, esmDev.warnings);
        generateESBuildDiagnostics(false, esmProd.warnings);
        generateESBuildDiagnostics(true, esmProd.warnings);
      }, console.error);
    },
    false,
  );

  return () => {
    stopTS();
    cjs.dev.stop();
    cjs.prod.stop();
    esm.dev.stop();
    esm.prod.stop();
  };
}

async function runCommand() {
  const response = await prompts({
    type: 'select',
    name: '_',
    message: 'Which command?',
    choices: [
      { title: 'build', value: 'build' },
      { title: 'clean', value: 'clean' },
      { title: 'check', value: 'check' },
      { title: 'create', value: 'create' },
      { title: 'init', value: 'init' },
      { title: 'lint', value: 'lint' },
      { title: 'watch', value: 'watch' },
    ],
    initial: 0,
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  switch (response._[0]) {
    case 'create':
      await runCreateCommand();
      break;
    case 'init':
      await runInitCommand();
      break;
    case 'clean':
      await runCleanCommand();
      break;
    case 'build':
      await runBuildCommand();
      break;
    case 'check':
      await runCheckCommand();
      break;
    case 'lint':
      await runLintCommand();
      break;
    case 'watch': {
      const cleanup = await runWatchCommand();
      process.on('exit', () => {
        cleanup();
      });
    }
      break;
    case 'test':
      await runJest(process.argv.slice(3));
      break;
    default:
      break;
  }
}

export default function runProgram(): void {
  runCommand().catch((err) => {
    console.error(err);
  });
}
