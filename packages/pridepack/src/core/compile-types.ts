import path from 'node:path';
import ts from 'typescript';
import type { PridepackConfig } from './default-config';
import { outputFile } from './fs-utils';
import getTSEntrypoints from './get-ts-entrypoints';
import readValidCompilerOptions from './read-valid-compiler-options';
import { DEFAULT_TYPES_OUTPUT } from './resolve-entrypoint';

interface OutputFile {
  name: string;
  data: string;
}

export default async function compileTypes(
  config: PridepackConfig,
  noEmit = true,
): Promise<ts.Diagnostic[]> {
  const options = await readValidCompilerOptions();
  const cwd = process.cwd();

  const baseConfig: ts.CompilerOptions = {
    ...options,
    outDir: path.resolve(
      path.join(cwd, config.outputDir, DEFAULT_TYPES_OUTPUT),
    ),
    emitDeclarationOnly: !noEmit,
    moduleResolution: 100,
    noEmit,
  };

  // Create a Program with an in-memory emit
  const host = ts.createCompilerHost(baseConfig);

  const files: OutputFile[] = [];

  host.writeFile = (name, data): void => {
    files.push({
      name,
      data,
    });
  };

  // Prepare and emit the d.ts files
  const program = ts.createProgram(getTSEntrypoints(config), baseConfig, host);

  const result = program.emit();

  await Promise.all(files.map(async file => outputFile(file.name, file.data)));

  return ts.getPreEmitDiagnostics(program).concat(result.diagnostics);
}
