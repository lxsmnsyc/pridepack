import path from 'path';
import type { CompilerOptions, TypeAcquisition } from 'typescript';
import ts from 'typescript';
import { readFileSync } from 'fs';
import readConfig from './read-config';

export interface TsConfig {
  compilerOptions: CompilerOptions;
  exclude: string[];
  compileOnSave: boolean;
  extends: string;
  files: string[];
  include: string[];
  typeAcquisition: TypeAcquisition;
}

let TSCONFIG: Partial<TsConfig>;

export async function getTSConfigPath(): Promise<string> {
  const config = await readConfig();
  return path.resolve(path.join(process.cwd(), config.tsconfig));
}

export default async function readTSConfig(): Promise<Partial<TsConfig>> {
  if (TSCONFIG) {
    return TSCONFIG;
  }

  // Read config
  const tsconfigPath = await getTSConfigPath();
  TSCONFIG = ts.readConfigFile(
    tsconfigPath,
    (filepath) => readFileSync(filepath, 'utf-8'),
  ).config as Partial<TsConfig>;

  return TSCONFIG;
}
