import { Box, Text } from 'ink';
import React from 'react';
import ESBuildReport from './ESBuildReport';
import IndefiniteMessage from './IndefiniteMessage';

export interface BuildDiagnosticsProps {
  pending: boolean;
  report?: string;
}

export default function BuildDiagnostics(
  { pending, report }: BuildDiagnosticsProps,
) {
  return (
    <Box flexDirection="column" marginLeft={1}>
      <Box>
        <Text color="blue">
          Build Diagnostics
        </Text>
      </Box>
      <Box marginLeft={1}>
        {
          pending
            ? (
              <IndefiniteMessage
                color="yellow"
                message="Building..."
                type="material"
              />
            )
            : (
              <ESBuildReport
                report={report}
              />
            )  
        }
      </Box>
    </Box>
  );
}

