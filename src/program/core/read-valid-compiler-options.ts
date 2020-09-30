import { CompilerOptions, convertCompilerOptionsFromJson } from 'typescript';
import readTSConfig from './read-tsconfig';

export default async function readValidCompilerOptions(): Promise<CompilerOptions> {
  return convertCompilerOptionsFromJson(
    (await readTSConfig()).compilerOptions,
    process.cwd(),
  ).options;
}