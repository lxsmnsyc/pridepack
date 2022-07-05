import path from 'path';
import { PridepackConfig } from './default-config';
import { outputJson } from './fs-utils';
import getPackagePath from './get-package-path';
import readPackage from './read-package';
import {
  getCJSTargetDirectory,
  getESMTargetDirectory,
  getTypesTarget,
} from './resolve-entrypoint';
import toPosix from './to-posix';

interface BaseExportEntry {
  require: string;
  import: string;
}

interface ExportEntry extends BaseExportEntry {
  development: BaseExportEntry;
  types: string;
}

function createBaseExportEntry(
  config: PridepackConfig,
  entry: string,
  jsx: string,
  isDev: boolean,
): BaseExportEntry {
  return {
    require: `./${toPosix(getCJSTargetDirectory(config, entry, isDev))}${jsx}`,
    import: `./${toPosix(getESMTargetDirectory(config, entry, isDev))}${jsx}`,
  };
}

function createExportEntry(
  config: PridepackConfig,
  entry: string,
  types: string,
  jsx: string,
): ExportEntry {
  return {
    development: createBaseExportEntry(config, entry, jsx, true),
    ...createBaseExportEntry(config, entry, jsx, false),
    types,
  };
}

export default async function patchPackageExports(
  config: PridepackConfig,
  cwd = '.',
): Promise<void> {
  const packageInfo = await readPackage(cwd);
  const jsx = config.jsx === 'preserve' ? '.jsx' : '.js';
  const entries: Record<string, ExportEntry> = {};
  const targetTSPaths: Record<string, [string]> = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const moduleEntry of Object.keys(config.entrypoints)) {
    const tsPath = await getTypesTarget(config.entrypoints[moduleEntry]);
    const typesPath = `./${toPosix(tsPath)}.d.ts`;
    entries[moduleEntry] = createExportEntry(
      config,
      moduleEntry,
      typesPath,
      jsx,
    );
    const targetPath = moduleEntry === '.' ? '*' : path.relative('.', moduleEntry);
    targetTSPaths[targetPath] = [typesPath];
  }

  await outputJson(
    getPackagePath(cwd),
    {
      ...packageInfo,
      exports: entries,
      typesVersions: {
        '*': targetTSPaths,
      },
    },
  );
}
