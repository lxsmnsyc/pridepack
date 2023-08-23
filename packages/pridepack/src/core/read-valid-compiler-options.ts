import ts from 'typescript';
import readTSConfig from './read-tsconfig';

export default async function readValidCompilerOptions(): Promise<ts.CompilerOptions> {
  const config = await readTSConfig();
  return ts.convertCompilerOptionsFromJson(
    config.compilerOptions,
    process.cwd(),
  ).options;
}
