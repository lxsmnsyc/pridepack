import React from 'react';
import { BuildResult, BuildFailure } from 'esbuild';
import { Box } from 'ink';
import { DiagnosticCategory } from 'typescript';

import { AsyncMemo } from '../utils/hooks/useAsyncMemo';
import DiagnosticMessage from '../utils/DiagnosticMessage';
import BuildResultDiagnostics from './BuildResultDiagnostics';

interface BuildSuccessProps {
  value: BuildResult;
}

function BuildSuccess({ value }: BuildSuccessProps): JSX.Element {
  return (
    <BuildResultDiagnostics
      messages={value.warnings}
      isWarning
    />
  );
}

interface BuildFailureProps {
  value: BuildFailure | Error;
}

function BuildFailure({ value }: BuildFailureProps): JSX.Element {
  if ('errors' in value && 'warnings' in value) {
    return (
      <>
        <BuildResultDiagnostics
          messages={value.errors}
        />
        <BuildResultDiagnostics
          messages={value.warnings}
        />
      </>
    );
  }

  return (
    <Box flexDirection="column" marginLeft={2}>
      <DiagnosticMessage
        category={DiagnosticCategory.Error}
        message={value.message}
      />
      {
        value.stack && (
          <DiagnosticMessage
            category={DiagnosticCategory.Error}
            message={value.stack}
          />
        )
      }
    </Box>
  );
}

interface BuildDiagnosticsProps {
  data: AsyncMemo<BuildResult, BuildFailure | Error>;
}

export default function BuildDiagnostics({ data }: BuildDiagnosticsProps): JSX.Element {
  if (data.status === 'success') {
    return <BuildSuccess value={data.result} />;
  }
  if (data.status === 'failure') {
    return <BuildFailure value={data.result} />;
  }
  return <></>;
}
