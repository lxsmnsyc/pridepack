import React from 'react';
import { Box, Spacer } from 'ink';

// Hooks
import { LoadableEvent, useLoadableRace } from '../utils/hooks/useLoadableEvent';

// Core
import { commandTitle } from '../core/styled-messages';
import { LintOptions } from '../core/run-linter';

// Components
import SuperDiagnosticMessage from '../utils/SuperDiagnosticMessage';
import Timer from '../utils/Timer';
import RunLinter from './RunLinter';

export interface LintProps extends LintOptions, LoadableEvent<void, undefined> {
}

export default function Lint({ files, fix, cache, ...props }: LintProps): JSX.Element {
  const {
    status,
    onSuccess,
    onFailure,
  } = useLoadableRace(props, files ? 1 : 2, [files, fix, cache]);

  const title = commandTitle('lint');

  return (
    <Box flexDirection="column" marginLeft={2}>
      <SuperDiagnosticMessage
        status={status}
        pending={title}
        success={title}
        failure={title}
      />
      <Spacer />
      <Box flexDirection="column" marginLeft={2}>
        {
          files
            ? (
              <RunLinter 
                files={files}
                fix={fix}
                cache={cache}
                pattern=""
                onFailure={onFailure}
                onSuccess={onSuccess}
              />
            )
            : (
              <>
                <RunLinter 
                  files={files}
                  fix={fix}
                  cache={cache}
                  pattern="src"
                  onFailure={onFailure}
                  onSuccess={onSuccess}
                />
                <RunLinter 
                  files={files}
                  fix={fix}
                  cache={cache}
                  pattern="test"
                  onFailure={onFailure}
                  onSuccess={onSuccess}
                />
              </>
            )
        }
      </Box>
      <Timer status={status} />
    </Box>
  );
}