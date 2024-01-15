import path from 'node:path';
import type { PridepackConfig } from './default-config';
import readConfig from './read-config';
import readTSConfig from './read-tsconfig';

export const DEFAULT_CJS_OUTPUT = 'cjs';
export const DEFAULT_CJS_PRODUCTION_ENTRY = 'production';
export const DEFAULT_CJS_DEVELOPMENT_ENTRY = 'development';

export function getCJSTargetDirectory(
  config: PridepackConfig,
  moduleEntry: string,
  isDev: boolean,
): string {
  return path.join(
    config.outputDir,
    DEFAULT_CJS_OUTPUT,
    isDev ? DEFAULT_CJS_DEVELOPMENT_ENTRY : DEFAULT_CJS_PRODUCTION_ENTRY,
    moduleEntry === '.' ? './index' : moduleEntry,
  );
}

export const DEFAULT_ESM_OUTPUT = 'esm';
export const DEFAULT_ESM_PRODUCTION_ENTRY = 'production';
export const DEFAULT_ESM_DEVELOPMENT_ENTRY = 'development';

export function getESMTargetDirectory(
  config: PridepackConfig,
  moduleEntry: string,
  isDev: boolean,
): string {
  return path.join(
    config.outputDir,
    DEFAULT_ESM_OUTPUT,
    isDev ? DEFAULT_ESM_DEVELOPMENT_ENTRY : DEFAULT_ESM_PRODUCTION_ENTRY,
    moduleEntry === '.' ? './index' : moduleEntry,
  );
}

export const DEFAULT_TYPES_OUTPUT = 'types';

export async function getTypesTarget(entrypoint: string): Promise<string> {
  const tsconfig = await readTSConfig();
  const config = await readConfig();
  const root = tsconfig.compilerOptions?.rootDir;
  if (!root) {
    throw new Error('Missing `rootDir` in tsconfig.json');
  }
  const cwd = process.cwd();
  const targetEntry = path.join(cwd, entrypoint);
  const targetRoot = path.join(cwd, root);
  const targetPath = path.relative(targetRoot, targetEntry);
  const parsed = path.parse(targetPath);
  return path.join(
    config.outputDir,
    DEFAULT_TYPES_OUTPUT,
    parsed.dir,
    parsed.name,
  );
}
