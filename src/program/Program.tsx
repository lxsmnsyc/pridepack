import { render } from 'ink';
import React from 'react';
import Build from './Build';
import Check from './Check';
import Clean from './Clean';
import CreatePackage from './Init/CreatePackage'
import InitPackage from './Init/InitPackage';
import Lint, { LintProps } from './Lint';
import Test from './Test';
import Watch from './Watch';

export type ProgramCommand =
  | 'build'
  | 'create'
  | 'init'
  | 'test'
  | 'watch'
  | 'clean'
  | 'check'
  | 'lint'

export interface ProgramProps extends LintProps {
  command: ProgramCommand;
  template?: string;
  packageName?: string;
}

function Program(
  {
    command,
    template,
    packageName,
    files,
    fix,
    cache,
  }: ProgramProps,
) {
  if (command === 'create' && packageName) {
    return (
      <CreatePackage
        template={template ?? 'basic'}
        packageName={packageName}
      />
    );
  }
  if (command === 'init') {
    return (
      <InitPackage
        template={template ?? 'basic'}
      />
    );
  }
  if (command === 'clean') {
    return <Clean />;
  }
  if (command === 'check') {
    return <Check />;
  }
  if (command === 'build') {
    return <Build />;
  }
  if (command === 'watch') {
    return <Watch />;
  }
  if (command === 'test') {
    return <Test />;
  }
  if (command === 'lint') {
    return <Lint files={files} fix={fix} cache={cache} />;
  }

  return <></>
}

export default function renderProgram(props: ProgramProps) {
  render((
    <Program {...props} />
  ), {
    patchConsole: true,
  });
}
