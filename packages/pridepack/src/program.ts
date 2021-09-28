import prompts from 'prompts';
import runJest from './core/run-jest';
import runBuildCommand from './program/run-build-command';
import runCleanCommand from './program/run-clean-command';
import runCheckCommand from './program/run-check-command';
import runCreateCommand from './program/run-create-command';
import runInitCommand from './program/run-init-command';
import runLintCommand from './program/run-lint-command';
import runWatchCommand from './program/run-watch-command';
import runStartCommand from './program/run-start-command';

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
      { title: 'start', value: 'start' },
      { title: 'dev', value: 'dev' },
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
    case 'start':
      await runStartCommand(false);
      break;
    case 'dev':
      await runStartCommand(true);
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
