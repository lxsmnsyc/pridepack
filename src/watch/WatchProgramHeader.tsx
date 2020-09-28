import { Box } from 'ink';
import React from 'react';
import IndefiniteMessage from './IndefiniteMessage';

export default function WatchProgramHeader(): JSX.Element {
  return (
    <Box>
      <IndefiniteMessage
        type="dots3"
        message="Compiling in watch mode..."
        color="magenta"
      />
    </Box>
  );
}