import { Box } from 'ink';
import React from 'react';
import BuildEntry from '../Build/BuildEntry';
import BuildOutput from '../Build/BuildOutput';
import { commandTitle } from '../core/styled-messages';
import useRemount from '../utils/hooks/useRemount';
import IndefiniteMessage from '../utils/IndefiniteMessage';
import WatchCompileTypes from './WatchCompileTypes';

export default function Watch() {
  const [key, remount] = useRemount();

  const title = commandTitle('watch');

  return (
    <Box flexDirection="column">
      <IndefiniteMessage
        color="magenta"
        message={title}
        type="dots3"
      />
      <Box flexDirection="column" marginLeft={2}>
        <BuildEntry
          key={`entry-${key}`}
        />
        <BuildOutput
          key={`output-${key}`}
        />
        <WatchCompileTypes
          remount={remount}
        />
      </Box>
    </Box>
  );
}