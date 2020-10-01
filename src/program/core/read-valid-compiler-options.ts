import { CompilerOptions, convertCompilerOptionsFromJson } from 'typescript';
import readTSConfig from './read-tsconfig';

export default function readValidCompilerOptions(): CompilerOptions {
  return convertCompilerOptionsFromJson(
    readTSConfig().compilerOptions,
    process.cwd(),
  ).options;
}