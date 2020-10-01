import { render } from 'ink';
import React from 'react';
import Build from './Build';
import Check from './Check';
import Clean from './Clean';
import CreatePackage from './Init/CreatePackage'
import InitPackage from './Init/InitPackage';

export type ProgramCommand =
  | 'build'
  | 'create'
  | 'init'
  | 'test'
  | 'watch'
  | 'clean'
  | 'check'
  | 'lint'

export interface ProgramProps {
  command: ProgramCommand;
  template?: string;
  packageName?: string;
}

function Program(
  { command, template, packageName }: ProgramProps,
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

  return <></>
}

export default function renderProgram(
  command: ProgramCommand,
  template?: string,
  packageName?: string,
) {
  render((
    <Program
      command={command}
      template={template}
      packageName={packageName}
    />
  ), {
    patchConsole: true,
  });
}
