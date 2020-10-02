import React from 'react';
import { Box, Spacer } from 'ink';
import { ESLint } from 'eslint';

// Hooks
import useAsyncMemo from '../utils/hooks/useAsyncMemo';
import useLoadableEvent, { LoadableEvent } from '../utils/hooks/useLoadableEvent';

// Core
import { pendingMessage, successMessage } from '../core/styled-messages';
import runLinter, { LintOptions } from '../core/run-linter';

// Components
import SuperDiagnosticMessage from '../utils/SuperDiagnosticMessage';
import LinterResult from './LinterResult';


interface RunLinterProps extends LintOptions, LoadableEvent<ESLint.LintResult[], Error> {
  pattern: string;
}

export default function RunLinter(
  { files, fix, cache, pattern, ...props }: RunLinterProps,
): JSX.Element {
  const data = useAsyncMemo<ESLint.LintResult[], Error>(
    () => runLinter({ files, fix, cache }, pattern),
    [files, fix, cache, pattern],
  );

  useLoadableEvent(props, data);

  return (
    <Box flexDirection="column">
      <SuperDiagnosticMessage
        status={data.status}
        pending={pendingMessage('Running', `ESLint for file pattern '${pattern}'`)}
        success={successMessage('Ran', `ESLint for file pattern '${pattern}'`)}
      />
      <Spacer />
      <Box flexDirection="column" marginLeft={2}>
        {
          data.status === 'success' && data.result.map((result) => (
            <LinterResult
              key={result.filePath}
              result={result}
            />
          ))
        }
      </Box>
    </Box>
  );
}