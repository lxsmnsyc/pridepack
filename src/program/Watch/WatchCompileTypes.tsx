import { Box } from 'ink';
import React, { useEffect, useState } from 'react';
import { Diagnostic } from 'typescript';
import CompileTypesDiagnostics, { diagnosticToMessage } from '../Build/CompileTypesDiagnostics';
import watchCompileTypes from '../core/watch-compile-types';
import { Remount } from '../utils/hooks/useRemount';
import DiagnosticMessage from '../utils/DiagnosticMessage';
import IndefiniteMessage from '../utils/IndefiniteMessage';
import chalk from 'chalk';

interface WatchCompileTypesProps {
  remount: Remount;
  noEmit?: boolean;
}

export default function WatchCompileTypes(
  { remount, noEmit }: WatchCompileTypesProps,
): JSX.Element {
  const [watchStatus, setWatchStatus] = useState<Diagnostic | undefined>();
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([]);

  useEffect(() => {
    let collectDiagnostics = false;

    return watchCompileTypes(
      (diagnostic) => {
        setDiagnostics((current) => [...current, diagnostic]);
      },
      (diagnostic) => {
        collectDiagnostics = !collectDiagnostics;

        if (collectDiagnostics) {
          setDiagnostics([]);
        }

        setWatchStatus(diagnostic);
        remount();
      },
      noEmit,
    );
  }, [remount, noEmit]);

  return (
    <Box flexDirection="column">
      <IndefiniteMessage
        color="magenta"
        message={chalk.magenta('Compiling in watch mode...')}
        type="dots3"
      />
      <Box flexDirection="column" marginLeft={2}>
        {
          watchStatus && (
            <DiagnosticMessage
              category={watchStatus.category}
              message={diagnosticToMessage(watchStatus)}
            />
          )
        }
        <CompileTypesDiagnostics
          diagnostics={diagnostics}
        />
      </Box>
    </Box>
  );
}