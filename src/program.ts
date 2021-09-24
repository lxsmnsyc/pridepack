import chalk from 'chalk';
import { Message } from 'esbuild';
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
import TEMPLATES from './program/core/templates';

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

export interface DiagnosticMessageProps {
}

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
    )
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
    )
  }
}

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

async function runCreateCommand() {
  const packageName = await prompts({
    type: 'text',
    name: 'name',
    message: `What's your package name?`
  });
  const directory = getSafePackageName(packageName.name);
  await task('Generating package.json...', async (ctx) => {
    await createPackage(packageName.name, directory);
    ctx.setTitle('Generated package.json.');
  });
  const templateName = await chooseTemplate();
  await task(`Copying from template '${templateName.template}'...`, async (ctx) => {
    await copyFromTemplate(templateName.template, directory);
    ctx.setTitle(`Copied from template '${templateName.template}'!`)
  });
  await task(`Installing dependencies from '${templateName.template}'...`, async (ctx) => {
    await installDeps(templateName.template, directory);
    ctx.setTitle(`Installed dependencies from '${templateName.template}'!`)
  });
}

async function runInitCommand() {
  await task('Generating package.json...', async (ctx) => {
    await createPackage(getCWDName(), '.');
    ctx.setTitle('Generated package.json!');
  });
  const templateName = await chooseTemplate();
  await task(`Copying from template '${templateName.template}'...`, async (ctx) => {
    await copyFromTemplate(templateName.template, '.');
    ctx.setTitle(`Copied from template '${templateName.template}'!`)
  });
  await task(`Installing dependencies from '${templateName.template}'...`, async (ctx) => {
    await installDeps(templateName.template);
    ctx.setTitle(`Installed dependencies from '${templateName.template}'!`)
  });
}

async function runCleanCommand() {
  await task('Cleaning build directory...', async (ctx) => {
    await clean();
    ctx.setTitle('Cleaned!')
  });
}


async function runBuildCommand() {
  await task('Building CJS files...', async (ctx) => {
    await ctx.task('Building development...', async ({ setTitle }) => {
      const result = await buildCJSDevelopment();
      generateESBuildDiagnostics(false, result.errors);
      generateESBuildDiagnostics(true, result.warnings);
      setTitle('Built development!');
    });
    await ctx.task('Building production...', async ({ setTitle }) => {
      const result = await buildCJSProduction();
      generateESBuildDiagnostics(false, result.errors);
      generateESBuildDiagnostics(true, result.warnings);
      setTitle('Built production!');
    });
    ctx.setTitle('Built CJS files!');
  });
  await task('Building ESM files...', async (ctx) => {
    await ctx.task('Building development...', async ({ setTitle }) => {
      const result = await buildESMDevelopment();
      generateESBuildDiagnostics(false, result.errors);
      generateESBuildDiagnostics(true, result.warnings);
      setTitle('Built development!');
    });
    await ctx.task('Building production...', async ({ setTitle }) => {
      const result = await buildESMProduction();
      generateESBuildDiagnostics(false, result.errors);
      generateESBuildDiagnostics(true, result.warnings);
      setTitle('Built production!');
    });
    ctx.setTitle('Built ESM files!');
  });
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
  }
}

export default function runProgram() {
  runCommand().catch((err) => {
    console.error(err);
  });
}