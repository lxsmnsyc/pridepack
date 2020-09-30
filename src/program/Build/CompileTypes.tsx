import React from 'react';
import { Box } from 'ink';
import { Diagnostic, flattenDiagnosticMessageText } from 'typescript';
import path from 'path';

// Hooks
import useAsyncMemo from '../utils/hooks/useAsyncMemo';
import useLoadableEvent, { LoadableEvent } from '../utils/hooks/useLoadableEvent';

// Core
import compileTypes from '../core/compile-types';

// Components
import SuperDiagnosticMessage from '../utils/SuperDiagnosticMessage';
import DiagnosticMessage from '../utils/DiagnosticMessage';

interface CompileTypesDiagnosticsProps {
  diagnostics: Diagnostic[];
}

function diagnosticToMessage(diagnostic: Diagnostic): string {
  const baseMessage = flattenDiagnosticMessageText(diagnostic.messageText, '\n');
  if (diagnostic.file) {
    const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start!);
    const fileName = path.relative(process.cwd(), diagnostic.file.fileName);
    return `${fileName} (${line + 1},${character + 1}): ${baseMessage}`;
  }

  return baseMessage;
}


function CompileTypesDiagnostics(
  { diagnostics }: CompileTypesDiagnosticsProps,
): JSX.Element {
  return (
    <Box flexDirection="column" marginLeft={2}>
      {
        diagnostics.map((diagnostic, index) => (
          <Box key={`diagnostic-${index}`}>
            <DiagnosticMessage
              category={diagnostic.category}
              message={diagnosticToMessage(diagnostic)}
            />
          </Box>
        ))
      }
    </Box>
  )
}

export interface CompileTypesProps extends LoadableEvent<Diagnostic[], Error> {
  noEmit: boolean;
}

export default function CompileTypes(
  { noEmit, ...props}: CompileTypesProps,
): JSX.Element {
  const data = useAsyncMemo<Diagnostic[], Error>(
    () => compileTypes(noEmit),
    [],
  );

  useLoadableEvent(props, data);

  return (
    <Box flexDirection="column">
      <SuperDiagnosticMessage
        status={data.status}
        pending="Compiling type declarations..."
        success="Compiled type declarations."
        failure={(data.result && data.result instanceof Error ) ? data.result.message : undefined}
      />
      {
        data.status === 'success' && (
          <CompileTypesDiagnostics diagnostics={data.result} />
        )
      }
    </Box>
  );
}