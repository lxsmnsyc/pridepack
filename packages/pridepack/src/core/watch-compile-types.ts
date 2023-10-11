import path from 'path';
import ts from 'typescript';
import { getTSConfigPath } from './read-tsconfig';
import readValidCompilerOptions from './read-valid-compiler-options';
import { DEFAULT_TYPES_OUTPUT } from './resolve-entrypoint';

export type EndCompile = () => void;
export type ReadDiagnostic = (diagnostic: ts.Diagnostic) => void;

export default function watchCompileTypes(
  reportDiagnostic: ReadDiagnostic,
  reportWatchStatus: ReadDiagnostic,
  noEmit?: boolean,
): EndCompile {
  let ready = true;

  let program: ts.WatchOfConfigFile<any>;

  async function setup(): Promise<void> {
    if (!ready) {
      return;
    }

    const options = await readValidCompilerOptions();

    const baseConfig: ts.CompilerOptions = {
      ...options,
      outDir: path.resolve(
        path.join(
          process.cwd(),
          DEFAULT_TYPES_OUTPUT,
        ),
      ),
      emitDeclarationOnly: !noEmit,
      moduleResolution: 100,
      noEmit,
    };

    // Create a Program with an in-memory emit

    if (!ready) {
      return;
    }

    const host = ts.createWatchCompilerHost(
      await getTSConfigPath(),
      baseConfig,
      ts.sys,
      ts.createSemanticDiagnosticsBuilderProgram,
      reportDiagnostic,
      reportWatchStatus,
    );

    // Prepare and emit the d.ts files
    program = ts.createWatchProgram(
      host,
    );
  }

  setup().catch((err) => {
    program.close();
    console.error(err);
    process.exit(1);
  });

  return () => {
    ready = false;
    if (program) {
      program.close();
    }
  };
}
