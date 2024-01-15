import prompts from 'prompts';
import runBuildCommand from './program/run-build-command';
import runCleanCommand from './program/run-clean-command';
import runCreateCommand from './program/run-create-command';
import runInitCommand from './program/run-init-command';
import runWatchCommand from './program/run-watch-command';
import runStartCommand from './program/run-start-command';
import runCompile from './program/run-compile';
import crash from './program/graceful-crash';

async function runCommand(): Promise<void> {
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
      { title: 'watch', value: 'watch' },
      { title: 'start', value: 'start' },
      { title: 'dev', value: 'dev' },
    ],
    initial: 0,
    onState: crash,
  });

  switch (response._[0]) {
    case 'create': {
      await runCreateCommand();
      break;
    }
    case 'init': {
      await runInitCommand();
      break;
    }
    case 'clean': {
      await runCleanCommand();
      break;
    }
    case 'build': {
      await runBuildCommand();
      break;
    }
    case 'check': {
      await runCompile(true);
      break;
    }
    case 'watch': {
      await runWatchCommand();
      break;
    }
    case 'start': {
      await runStartCommand(false);
      break;
    }
    case 'dev': {
      await runStartCommand(true);
      break;
    }
  }
}

export default function runProgram(): void {
  runCommand().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
