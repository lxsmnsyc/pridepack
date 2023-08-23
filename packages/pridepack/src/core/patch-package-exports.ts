import path from 'path';
import type { PridepackConfig } from './default-config';
import { outputJson } from './fs-utils';
import getExtensionJS from './get-extension-js';
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
  isModule: boolean,
  isJSX: boolean,
  isDev: boolean,
): BaseExportEntry {
  return {
    require: `./${toPosix(getCJSTargetDirectory(config, entry, isDev))}${getExtensionJS(isModule, isJSX, false)}`,
    import: `./${toPosix(getESMTargetDirectory(config, entry, isDev))}${getExtensionJS(isModule, isJSX, true)}`,
  };
}

function createExportEntry(
  config: PridepackConfig,
  entry: string,
  types: string,
  isModule: boolean,
  isJSX: boolean,
): ExportEntry {
  return {
    development: createBaseExportEntry(config, entry, isModule, isJSX, true),
    ...createBaseExportEntry(config, entry, isModule, isJSX, false),
    types,
  };
}

export default async function patchPackageExports(
  config: PridepackConfig,
  cwd = '.',
): Promise<void> {
  const packageInfo = await readPackage(cwd);
  const isModule = packageInfo.type === 'module';
  const isJSX = config.jsx === 'preserve';
  const entries: Record<string, ExportEntry> = {};
  const targetTSPaths: Record<string, [string]> = {};
  let types: string | undefined;

  let mainTarget: string | undefined;
  let moduleTarget: string | undefined;

  // eslint-disable-next-line no-restricted-syntax
  for (const moduleEntry of Object.keys(config.entrypoints)) {
    const tsPath = await getTypesTarget(config.entrypoints[moduleEntry]);
    const typesPath = `./${toPosix(tsPath)}.d.ts`;
    entries[moduleEntry] = createExportEntry(
      config,
      moduleEntry,
      typesPath,
      isModule,
      isJSX,
    );
    if (moduleEntry === '.') {
      types = typesPath;
      mainTarget = entries[moduleEntry].require;
      moduleTarget = entries[moduleEntry].import;
    } else {
      const resolved = path.posix.relative('.', moduleEntry);
      targetTSPaths[resolved] = [typesPath];
    }
  }

  await outputJson(
    getPackagePath(cwd),
    {
      ...packageInfo,
      types,
      main: mainTarget,
      module: moduleTarget,
      exports: entries,
      typesVersions: {
        '*': targetTSPaths,
      },
    },
  );
}
