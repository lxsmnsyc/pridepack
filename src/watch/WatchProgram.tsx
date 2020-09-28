import {
  Box,
  render,
  Spacer,
  Text,
} from 'ink';
import React, { useEffect, useState } from 'react';
import {
  CompilerOptions,
  createWatchCompilerHost,
  sys,
  createSemanticDiagnosticsBuilderProgram,
  createWatchProgram,
  DiagnosticMessageChain,
  DiagnosticCategory,
  Diagnostic,
} from 'typescript';
import readConfigWithCWD from '../utils/read-config-with-cwd';
import readTSConfig from '../utils/read-tsconfig';
import buildDevelopment from '../build/build-development';
import buildProduction from '../build/build-production';
import buildESM from '../build/build-esm';
import buildOut from '../build/build-out';
import WatchProgramHeader from './WatchProgramHeader';
import BuildDiagnostics from './BuildDiagnostics';
import DiagnosticMessage from './DiagnosticMessage';

interface DiagnosticMessageSimple {
  messageText: string;
  code: number;
  category: DiagnosticCategory;
}

function messageChainToArray(
  messageChain?: DiagnosticMessageChain[],
): DiagnosticMessageSimple[] {
  const result: DiagnosticMessageSimple[] = [];

  if (messageChain) {
    messageChain.forEach((message) => {
      result.push(message);
      const results = messageChainToArray(message.next);
      results.forEach((innerMessage) => {
        result.push(innerMessage);
      });
    });
  }

  return result;
}

function WatchProgram() {
  const [watchStatus, setWatchStatus] = useState<DiagnosticMessageSimple[]>([]);
  const [diagnostic, setDiagnostic] = useState<DiagnosticMessageSimple[]>([]);
  const [esbuildReport, setESBuildReport] = useState<string | undefined>();
  const [esbuildPending, setESBuildPending] = useState(false);

  useEffect(() => {
    const baseConfig: CompilerOptions = {
      ...readTSConfig().compilerOptions,
      outDir: readConfigWithCWD().outDir,
      emitDeclarationOnly: true,
      moduleResolution: 2,
    };

    let collectDiagnostic = false;

    function reportDiagnostic(base: Diagnostic) {
      const { messageText, code, category } = base;
      if (typeof messageText === 'string') {
        setDiagnostic((current) => [
          {
            messageText,
            code,
            category,
          },
          ...current,
        ]);
      } else {
        setDiagnostic((current) => [
          ...messageChainToArray([ messageText ]),
          ...current,
        ]);
      }
    }

    function reportWatchStatusChanged(base: Diagnostic) {
      const { messageText, code, category } = base;

      if (typeof messageText === 'string') {
        if (!collectDiagnostic) {
          setDiagnostic([]);
        }
        collectDiagnostic = !messageText.includes('Found');
        setWatchStatus([
          {
            messageText,
            code,
            category,
          }
        ]);
      } else {
        setWatchStatus(messageChainToArray([ messageText ]));
      }

      setESBuildPending(true);
      setESBuildReport(undefined);
      buildDevelopment(true).then(
        () => buildProduction(true),
      ).then(
        () => buildESM(true),
      ).then(
        buildOut
      ).then(
        () => {
          setESBuildPending(false);
        },
        (err: Error) => {
          setESBuildPending(false);
          setESBuildReport(err.message);
        },
      );
    }

    // Create a Program with an in-memory emit
    const host = createWatchCompilerHost(
      readConfigWithCWD().tsconfig,
      baseConfig,
      sys,
      createSemanticDiagnosticsBuilderProgram,
      reportDiagnostic,
      reportWatchStatusChanged,
    );
  
    // Prepare and emit the d.ts files
    const program = createWatchProgram(
      host,
    );

    return () => {
      program.close();
    };
  }, []);

  return (
    <Box flexDirection="column">
      <WatchProgramHeader />
      <Spacer />
      <Box flexDirection="column" marginLeft={1}>
        <Box>
          <Text color="blue">
            TypeScript Diagnostics
          </Text>
        </Box>
        <Spacer />
        <Box flexDirection="column" marginLeft={1} height={watchStatus.length}>
          {watchStatus.map((value, index) => (
            <Box key={`status-${index}`}>
              <DiagnosticMessage
                category={value.category}
                message={value.messageText}
              />
            </Box>
          ))}
        </Box>
        <Spacer />
        <Box flexDirection="column" marginLeft={2} height={diagnostic.length}>
          {diagnostic.map((value, index) => (
            <Box key={`diagnostic-${index}`}>
              <DiagnosticMessage
                category={value.category}
                message={value.messageText}
              />
            </Box>
          ))}
        </Box>
      </Box>
      <Spacer />
      <BuildDiagnostics
        report={esbuildReport}
        pending={esbuildPending}
      />
    </Box>
  );
}


export default function renderWatchProgram() {
  render(<WatchProgram />, {
    patchConsole: true,
  });
}