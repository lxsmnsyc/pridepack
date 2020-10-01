import { CompilerOptions, createSemanticDiagnosticsBuilderProgram, createWatchCompilerHost, createWatchProgram, Diagnostic, sys } from 'typescript';

import readConfigWithCWD from './read-config-with-cwd';
import readValidCompilerOptions from './read-valid-compiler-options';

export type EndCompile = () => void;
export type ReadDiagnostic = (diagnostic: Diagnostic) => void;

export default function watchCompileTypes(
  reportDiagnostic: ReadDiagnostic,
  reportWatchStatus: ReadDiagnostic,
  noEmit?: boolean,
) {
  const config = readConfigWithCWD();

  const baseConfig: CompilerOptions = {
    ...readValidCompilerOptions(),
    outDir: config.outDir,
    emitDeclarationOnly: !noEmit,
    moduleResolution: 2,
    noEmit,
  };

  // Create a Program with an in-memory emit
  const host = createWatchCompilerHost(
    readConfigWithCWD().tsconfig,
    baseConfig,
    sys,
    createSemanticDiagnosticsBuilderProgram,
    reportDiagnostic,
    reportWatchStatus,
  );

  // Prepare and emit the d.ts files
  const program = createWatchProgram(
    host,
  );

  return () => {
    program.close();
  };
}